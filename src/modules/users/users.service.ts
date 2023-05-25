import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.userModel.scope('withoutPassword').findAll();
  }

  async createUser(user: UserDto): Promise<User> {
    const createdUser = await this.userModel.create<User>(user);

    if (createdUser) return createdUser.dataValues;

    return null;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne<User>({
      where: { email: email },
    });

    if (user) return user.dataValues;

    return null;
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userModel.findOne<User>({ where: { id: id } });

    if (user) return user.dataValues;

    return null;
  }

  async updateById(id: string, updateData: UpdateUserDto): Promise<number> {
    const [affectedCount] = await this.userModel.update(updateData, {
      where: { id: id },
    });

    return affectedCount;
  }

  async uploadImageToCloudinary(file: Express.Multer.File) {
    return await this.cloudinary.uploadImage(file);
  }
}
