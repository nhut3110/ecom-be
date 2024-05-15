import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  Comment,
  CommentImage,
  CommentReaction,
  CommentReport,
} from './comment.entity';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Comment,
      CommentImage,
      User,
      Product,
      CommentReaction,
      CommentReport,
    ]),
    CloudinaryModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
