import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize/dist';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { CloudinaryModule } from 'src/modules/cloudinary/cloudinary.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), CloudinaryModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
