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
import { ProductAdditionalImagesModule } from './modules/product_additional_images/product_additional_images.module';
import { ProductAdditionalImage } from './modules/product_additional_images/product_additional_image.entity';
import { ProxyModule } from './proxy/proxy.module';
import { ProxyService } from './proxy/proxy.service';
import { ProxyController } from './proxy/proxy.controller';
import { HttpModule } from '@nestjs/axios';
import { DiscountModule } from './modules/discounts/discounts.module';
import { InstructionModule } from './modules/lego_instructions/lego_instructions.module';
import { Discount } from './modules/discounts/discount.entity';
import { UserDiscount } from './modules/discounts/user_discount.entity';
import { Instruction } from './modules/lego_instructions/lego_instruction.entity';
import { CommentsModule } from './modules/comments/comments.module';
import {
  Comment,
  CommentImage,
  CommentReaction,
  CommentReport,
} from './modules/comments/comment.entity';
import { DiscussionModule } from './modules/discussions/discussions.module';
import { Discussion } from './modules/discussions/discussion.entity';
import { AppController } from './app.controller';
import {
  ThrottlerGuard,
  ThrottlerModule,
  seconds,
} from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    AppConfigModule,
    CloudinaryModule,
    ProductModule,
    CategoriesModule,
    ThrottlerModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => [
        {
          ttl: seconds(appConfigService.rateTtl),
          limit: appConfigService.rateLimit,
          storage: new ThrottlerStorageRedisService(appConfigService.redisUrl),
        },
      ],
    }),
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
          dialectOptions: {
            ssl: {
              rejectUnauthorized: true,
              ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUNSpJLHZlkc36c11riyTNwlG0KVQwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvNWEwYmRmOWItYjllZS00NjcwLTliM2ItYjBjNTEyMjhj
YTQ4IFByb2plY3QgQ0EwHhcNMjQwNTE1MDg0NjEzWhcNMzQwNTEzMDg0NjEzWjA6
MTgwNgYDVQQDDC81YTBiZGY5Yi1iOWVlLTQ2NzAtOWIzYi1iMGM1MTIyOGNhNDgg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAJ6sgLo3
pG9FqH3pTREBtSLtgL/yuZ1Q60ew5DRbujBGXxSgDzgxmGEg2ZiZy+zTH7CBZ5f3
TUgLWrRI8syi0bam6fXOvWIMVHtLuqxmtJbv1qUP3Ov020vifcaouycO1RTk6nJU
Ker2g6CsvyqkKjImpbpnzBvkmQ3MdzoFPcKOmr/bY/qX6eEQ6lx+IklKGegCGSKp
vIL7G3TzxzQJyJ6OHiF0iVJIGn9kTGqfc3HVlkPYYsSFDQHV44O3fDdhE5ZZK4KO
KIV9N5EMCSVig6D/mR+SwSy9qe8s6eDES25s3XaorD1kdDXJyIvuhhp5UqQuLGoV
KrUtNo2DFBWCULs4jwS+08nWvLtsfPXsyv/BnPMVCOVxkZhFc8IwjHcD9FuIPls1
Yo2ZUMJsnP1ksfuSyLR+qDvvhV9QSgJoDVwMOL6ddzmgY1jgpU0t1BRg1lDHJyKk
AEQ8XmHxbjO3SWKTjSxcNsS5B4mWQNfPDdtU1nBqnvRIAJEnT9cMMHOkCQIDAQAB
oz8wPTAdBgNVHQ4EFgQUDnJKaJv8AfjRqRPuR9bx7IpjEAswDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAC2c7lSckgZEp/is
YwagKub7h2lb5DdNgi7euN8cIKFa8KZIrG8vVDez02nTZmbjit3tVBFn2EOxNRXs
Ho2fnR6NvN/xD3DtjSkpKkxHFHQB/S8BJ96tVurKMeh7pzvJMJrZjIhL+k8MMzgN
g8bQJISQSo5tEEshn6iaJ6a/2K6ba9mzhqge5VZGOkAQn1OXARP3zp273zxxf/BY
N1zonxh7Mfp6JbkWVN1ngn5ntS4j4tsITkay6ILvDZBZ8u9+eWwGP4J8cd1BhNA1
XQIt7evr/zZ1aiyJ7/eLmgIKkh7eP/52cc5tb3V6v1Z9K6X0vPe2sGoZ0viA6exu
c76ILMiRrToxZAJ/twFTeehHDM6UDbp+zcQGHXYSRhAr1TCsr/UlIppozPVAlbGn
bxvhxd+QA1U2FlxeukeCvCaJkuCj7vmyfHFWZuHrQs1/cskhulSjOlCIrCEXVo3Y
p/S/jxYk9y7E881tC14F4hvWbqSGrDOw48ObOKACub9EG3Uvug==
-----END CERTIFICATE-----`,
            },
          },
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
            ProductAdditionalImage,
            Discount,
            UserDiscount,
            Instruction,
            Comment,
            CommentImage,
            Discussion,
            CommentReaction,
            CommentReport,
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
    ProductAdditionalImagesModule,
    ProxyModule,
    HttpModule,
    DiscountModule,
    InstructionModule,
    CommentsModule,
    DiscussionModule,
  ],
  providers: [
    CloudinaryService,
    ProxyService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [ProxyController, AppController],
})
export class AppModule {}
