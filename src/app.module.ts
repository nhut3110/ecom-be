import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppConfigModule } from './modules/config/app-config.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductModule } from './modules/products/products.module';
import { CloudinaryService } from './modules/cloudinary/cloudinary.service';
import { AppConfigService } from './modules/config/app-config.service';
import { User } from './modules/users/user.entity';
import { Category } from './modules/categories/category.entity';
import { Product } from './modules/products/product.entity';
import { TokensModule } from './modules/tokens/tokens.module';
import { RedisModule } from './modules/redis/redis.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { Favorite } from './modules/favorites/favorite.entity';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    AppConfigModule,
    CloudinaryModule,
    ProductModule,
    CategoriesModule,
    SequelizeModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (appConfigService: AppConfigService) => {
        return {
          username: appConfigService.postgresUser,
          password: appConfigService.postgresPassword,
          database: appConfigService.postgresName,
          host: appConfigService.postgresHost,
          port: appConfigService.postgresPort,
          dialect: appConfigService.postgresDialect,
          autoLoadModels: true,
          models: [User, Category, Product, Favorite],
        };
      },
      inject: [AppConfigService],
    }),
    TokensModule,
    RedisModule,
    FavoritesModule,
  ],
  providers: [CloudinaryService],
})
export class AppModule {}
