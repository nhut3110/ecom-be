import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly cloudinary: CloudinaryService,
  ) {}

  getUsers(): Promise<User[]> {
    return this.userModel.scope('withoutPassword').findAll();
  }

  async createUser(user: UserDto): Promise<User> {
    const createdUser = await this.userModel.create<User>(user);

    if (createdUser) return createdUser.dataValues;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne<User>({
      where: { email: email },
    });

    if (user) return user.dataValues;
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userModel.findOne<User>({ where: { id: id } });

    if (user) return user.dataValues;
  }

  async updateById(id: string, updateData: UpdateUserDto): Promise<User> {
    await this.userModel.update(updateData, {
      where: { id: id },
    });

    return await this.userModel.findOne({
      where: { id: id },
    });
  }

  async uploadImageToCloudinary(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return await this.cloudinary.uploadImage(file);
  }
}
