import { Injectable } from '@nestjs/common';
import { User } from './types/user.type';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly usersMock: User[] = [
    {
      name: 'nhut',
      email: 'nhut@gmail.com',
      password: '$2a$10$rZSagaLx2NzzJhySoEgaPeBvNEH54KXRMXpctc8SssrzBCofrz0fm', //123456789
      picture: 'https://mcdn.coolmate.me/image/October2021/meme-cheems-1.png',
      refreshToken: '',
    },
    {
      name: 'nhut',
      email: 'admin@gmail.com',
      password: '$2a$10$zoOlQO5KP3z/F4gN8tdVcO9N4TqsgAhYh5VSQHV6EPiQaDPUpk8FC', //123456789
      picture: 'https://mcdn.coolmate.me/image/October2021/meme-cheems-1.png',
      refreshToken: '',
    },
  ];

  async create(createUserDto: CreateUserDto): Promise<void> {
    await this.usersMock.push(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return this.usersMock;
  }

  async findOneWithPassword(email: string): Promise<User | undefined> {
    return this.usersMock.find((user) => user.email === email);
  }

  async findOne(email: string): Promise<any> {
    const user = this.usersMock.find((user) => user.email === email);
    if (user)
      return {
        email: user.email,
        name: user.name,
        picture: user.picture,
        refreshToken: user.refreshToken,
      };
  }

  async update(email: string, updateUserDto: UpdateUserDto): Promise<void> {
    const { name, password, refreshToken } = updateUserDto;
    const updateUserIndex = this.usersMock.findIndex(
      (user) => user.email === email,
    );

    if (name) this.usersMock[updateUserIndex].name = name;
    if (password) this.usersMock[updateUserIndex].password = password;
    if (refreshToken)
      this.usersMock[updateUserIndex].refreshToken = refreshToken;

    return;
  }
}
