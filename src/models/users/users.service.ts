import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/common/constants/role.enum';

@Injectable()
export class UsersService {
  // Mock users to test
  private usersMock: User[] = [
    {
      name: 'nhut',
      username: 'nhut',
      password: '$2b$10$77MYWxgCQKeaMQm7SSlJ5epIKlkNT9exSXWv85n6f4jNfOe7S9176', //123456
      refreshToken: '',
      roles: [Role.USER],
    },
    {
      name: 'nhut',
      username: 'admin',
      password: '$2b$10$8P65SocPqOeZMq2QBdwAKOL1M17kKziuCWH4F6iNah9Xf4Nq3XQZG', //123456
      refreshToken: '',
      roles: [Role.ADMIN],
    },
  ];

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

  async delete(username: string) {
    this.usersMock = this.usersMock.filter(
      (user) => user.username !== username,
    );

    return;
  }
}
