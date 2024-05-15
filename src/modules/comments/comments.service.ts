import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  Comment,
  CommentImage,
  CommentReaction,
  CommentReport,
} from './comment.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateCommentDto, ReportCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../users/user.entity';
import { Sequelize } from 'sequelize-typescript';
import { Product } from '../products/product.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment)
    private readonly commentModel: typeof Comment,
    @InjectModel(CommentImage)
    private readonly commentImageModel: typeof CommentImage,
    @InjectModel(CommentReaction)
    private readonly commentReactionModel: typeof CommentReaction,
    @InjectModel(CommentReport)
    private readonly commentReportModel: typeof CommentReport,
    @InjectModel(Product)
    private readonly productModel: typeof Product,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(dto: CreateCommentDto): Promise<Comment> {
    const transaction = await this.commentModel.sequelize.transaction();
    try {
      const comment = await this.commentModel.create(dto, { transaction });
      if (dto.imageFiles) {
        const imageUrls = await Promise.all(
          dto.imageFiles.map((file) =>
            this.cloudinaryService.uploadImage(file),
          ),
        );
        await Promise.all(
          imageUrls.map((url) =>
            this.commentImageModel.create(
              { commentId: comment.id, imageUrl: url.url },
              { transaction },
            ),
          ),
        );
      }
      await transaction.commit();

      await this.updateProductRating(dto.productId);

      return comment;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findAll(userId: string, productId?: string): Promise<any[]> {
    const whereCondition = productId ? { productId } : {};
    const comments = await this.commentModel.findAll({
      where: whereCondition,
      include: [
        {
          model: CommentImage,
        },
        {
          model: User,
          attributes: ['id', 'name', 'picture'],
        },
        {
          model: CommentReaction,
          attributes: [],
        },
        {
          model: CommentReport,
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM "comment_reactions" AS "Reaction"
              WHERE
                "Reaction"."comment_id" = "Comment"."id"
                AND "Reaction"."type" = 'like'
            )`),
            'likeCount',
          ],
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM "comment_reactions" AS "Reaction"
              WHERE
                "Reaction"."comment_id" = "Comment"."id"
                AND "Reaction"."type" = 'dislike'
            )`),
            'dislikeCount',
          ],
          [
            Sequelize.literal(`(
              SELECT "type"
              FROM "comment_reactions" AS "Reaction"
              WHERE
                "Reaction"."comment_id" = "Comment"."id"
                AND "Reaction"."user_id" = '${userId}'
            )`),
            'currentUserReaction',
          ],
          [
            Sequelize.literal(`(
              EXISTS(
                SELECT 1
                FROM "comment_reports" AS "Report"
                WHERE
                  "Report"."comment_id" = "Comment"."id"
                  AND "Report"."reported_by_user_id" = '${userId}'
              )
            )`),
            'isCurrentUserReported',
          ],
        ],
      },
    });

    return comments.map((comment) => {
      const data = comment.toJSON();
      return {
        ...data,
        isCurrentUserReported: data.isCurrentUserReported === true,
        likeCount: parseInt(data.likeCount, 10), // Ensure number type
        dislikeCount: parseInt(data.dislikeCount, 10),
      };
    });
  }

  async findOne(id: string): Promise<Comment> {
    return this.commentModel.findByPk(id, {
      include: [
        { model: CommentImage },
        {
          model: User,
          attributes: ['id', 'name', 'picture'], // Specify the user attributes you want
        },
      ],
    });
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateCommentDto,
  ): Promise<Comment> {
    const transaction = await this.commentModel.sequelize.transaction();
    try {
      const comment = await this.commentModel.findByPk(id, { transaction });
      if (!comment) {
        await transaction.rollback();
        throw new Error('Comment not found');
      }
      if (comment.userId !== userId) {
        throw new Error('You do not have permission to update this comment');
      }
      await comment.update(dto, { transaction });
      if (dto.imageFiles) {
        await this.commentImageModel.destroy({
          where: { commentId: id },
          transaction,
        });
        const imageUrls = await Promise.all(
          dto.imageFiles.map((file) =>
            this.cloudinaryService.uploadImage(file),
          ),
        );
        await Promise.all(
          imageUrls.map((url) =>
            this.commentImageModel.create(
              { commentId: id, imageUrl: url.url },
              { transaction },
            ),
          ),
        );
      }
      await transaction.commit();

      await this.updateProductRating(comment.productId);

      return this.findOne(id); // Return the updated comment
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async remove(id: string, userId: string): Promise<void> {
    const transaction = await this.commentModel.sequelize.transaction();
    try {
      const comment = await this.commentModel.findByPk(id, { transaction });
      if (!comment) {
        await transaction.rollback();
        throw new Error('Comment not found');
      }
      if (comment.userId !== userId) {
        throw new Error('You do not have permission to delete this comment');
      }
      await this.commentImageModel.destroy({
        where: { commentId: id },
        transaction,
      });
      await comment.destroy({ transaction });
      await transaction.commit();

      await this.updateProductRating(comment.productId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async reactToComment(
    userId: string,
    commentId: string,
    type: 'like' | 'dislike',
  ): Promise<void> {
    const existingReaction = await this.commentReactionModel.findOne({
      where: { userId, commentId },
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        await existingReaction.destroy();
      } else {
        await existingReaction.update({ type });
      }
    } else {
      await this.commentReactionModel.create({
        userId,
        commentId,
        type,
      });
    }
  }

  async reportComment(dto: ReportCommentDto, userId: string): Promise<void> {
    // Check if the user is trying to report their own comment
    const comment = await this.commentModel.findByPk(dto.commentId);
    if (!comment) {
      throw new BadRequestException('Comment not found.');
    }
    if (comment.userId === userId) {
      throw new BadRequestException('You cannot report your own comment.');
    }

    // Check if the user has already reported this comment
    const existingReport = await this.commentReportModel.findOne({
      where: { reportedByUserId: userId, commentId: dto.commentId },
    });

    if (existingReport) {
      throw new BadRequestException('You have already reported this comment.');
    }

    // Create the report
    await this.commentReportModel.create({ ...dto, reportedByUserId: userId });
  }

  private async updateProductRating(productId: string): Promise<void> {
    const comments = await this.commentModel.findAll({
      where: { productId },
      attributes: ['rating'],
    });

    const averageRating =
      comments.reduce((acc, curr) => acc + curr.rating, 0) / comments.length ||
      0;

    await this.productModel.update(
      { rate: averageRating },
      { where: { id: productId } },
    );
  }
}
