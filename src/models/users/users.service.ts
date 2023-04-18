import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly usersMock: User[] = [];

  async create(user: User) {
    return this.usersMock.push(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersMock;
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.usersMock.find((user) => user.username === username);
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    const { name, password, refreshToken } = updateUserDto;
    const updateUserIndex = this.usersMock.findIndex(
      (user) => user.username === username,
    );

    if (name) this.usersMock[updateUserIndex].name = name;
    if (password) this.usersMock[updateUserIndex].password = password;
    if (refreshToken)
      this.usersMock[updateUserIndex].refreshToken = refreshToken;

    return;
  }
}
