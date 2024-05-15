import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Discussion } from './discussion.entity';
import { User } from '../users/user.entity';

@Injectable()
export class DiscussionsService {
  constructor(
    @InjectModel(Discussion)
    private readonly discussionModel: typeof Discussion,
  ) {}

  async create(dto: any): Promise<Discussion> {
    return this.discussionModel.create(dto);
  }

  async findAll(productId?: string): Promise<Discussion[]> {
    const whereCondition = productId
      ? { productId, parentId: null }
      : { parentId: null };
    const discussions = await this.discussionModel.findAll({
      where: whereCondition,
      include: [
        {
          model: Discussion,
          as: 'replies',
        },
        {
          model: User,
          attributes: ['id', 'name', 'picture'], // Include specific user attributes
        },
      ],
    });

    const addReplies = async (
      discussions: Discussion[],
    ): Promise<Discussion[]> => {
      for (const discussion of discussions) {
        const replies = await this.discussionModel.findAll({
          where: { parentId: discussion.id },
          include: [
            { model: Discussion, as: 'replies' },
            { model: User, attributes: ['id', 'name', 'picture'] },
          ],
        });
        discussion.setDataValue('replies', await addReplies(replies));
      }
      return discussions;
    };

    return addReplies(discussions);
  }

  async findOne(id: string): Promise<Discussion> {
    const discussion = await this.discussionModel.findByPk(id, {
      include: [{ model: Discussion, as: 'replies' }],
    });

    if (discussion) {
      discussion.setDataValue(
        'replies',
        await this.findAllReplies(discussion.id),
      );
    }
    return discussion;
  }

  async update(id: string, userId: string, dto: any): Promise<Discussion> {
    const discussion = await this.discussionModel.findByPk(id);
    if (!discussion) {
      throw new Error('Discussion not found');
    }
    if (discussion.userId !== userId) {
      throw new UnauthorizedException(
        'You do not have permission to update this discussion',
      );
    }

    const [updateCount] = await this.discussionModel.update(dto, {
      where: { id },
      returning: true,
    });

    if (updateCount === 0) {
      throw new Error('Unable to update discussion');
    }

    return this.findOne(id);
  }

  async remove(id: string, userId: string): Promise<void> {
    const discussion = await this.discussionModel.findByPk(id, {
      include: [{ model: Discussion, as: 'replies' }],
    });

    if (!discussion) {
      throw new Error('Discussion not found');
    }
    if (discussion.userId !== userId) {
      throw new UnauthorizedException(
        'You do not have permission to delete this discussion',
      );
    }

    const transaction = await this.discussionModel.sequelize.transaction();
    try {
      if (discussion.parentId) {
        await this.reassignChildren(
          discussion.id,
          discussion.parentId,
          transaction,
        );
      } else {
        await this.deleteAllChildren(discussion.id, transaction);
      }
      await discussion.destroy({ transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private async reassignChildren(
    discussionId: string,
    newParentId: string,
    transaction: any,
  ): Promise<void> {
    // Find all direct children of the discussion to be deleted
    const children = await this.discussionModel.findAll({
      where: { parentId: discussionId },
      transaction,
    });

    // Update each child to have a new parent
    for (const child of children) {
      await child.update({ parentId: newParentId }, { transaction });
    }
  }

  private async deleteAllChildren(
    parentId: string,
    transaction: any,
  ): Promise<void> {
    const children = await this.discussionModel.findAll({
      where: { parentId },
      transaction,
    });

    for (const child of children) {
      await this.deleteAllChildren(child.id, transaction); // Recursive delete
      await child.destroy({ transaction });
    }
  }

  private async findAllReplies(parentId: string): Promise<Discussion[]> {
    const discussions = await this.discussionModel.findAll({
      where: { parentId: parentId },
      include: [{ model: Discussion, as: 'replies' }],
    });

    for (const discussion of discussions) {
      const replies = await this.findAllReplies(discussion.id);
      discussion.setDataValue('replies', replies);
    }

    return discussions;
  }
}
