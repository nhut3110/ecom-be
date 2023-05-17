import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

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

  async deleteById(id: string): Promise<number> {
    return await this.userModel.destroy({ where: { id: id } });
  }
}
