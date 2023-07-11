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
import { FavoriteModule } from './modules/favorites/favorites.module';
import { Favorite } from './modules/favorites/favorite.entity';
import { CartModule } from './modules/carts/carts.module';
import { Cart } from './modules/carts/cart.entity';
import { AddressModule } from './modules/addresses/addresses.module';
import { PaymentModule } from './modules/payment/payment.module';
import { Address } from './modules/addresses/address.entity';
import { Payment } from './modules/payment/payment.entity';
import { OrderModule } from './modules/orders/orders.module';
import { Order } from './modules/orders/entities/order.entity';
import { OrderDetail } from './modules/orders/entities/order-detail.entity';
import { MailModule } from './modules/mail/mail.module';
import { OtpModule } from './modules/otp/otp.module';

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
          models: [
            User,
            Category,
            Product,
            Favorite,
            Cart,
            Address,
            Payment,
            Order,
            OrderDetail,
          ],
        };
      },
      inject: [AppConfigService],
    }),
    TokensModule,
    RedisModule,
    FavoriteModule,
    CartModule,
    AddressModule,
    PaymentModule,
    OrderModule,
    MailModule,
    OtpModule,
  ],
  providers: [CloudinaryService],
})
export class AppModule {}
