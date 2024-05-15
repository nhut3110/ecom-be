import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DiscussionsService } from './discussions.service';
import { DiscussionsController } from './discussions.controller';
import { Discussion } from './discussion.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([Discussion, User])],
  controllers: [DiscussionsController],
  providers: [DiscussionsService],
})
export class DiscussionModule {}
