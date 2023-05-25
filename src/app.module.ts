import { Module } from '@nestjs/common';
import { AppConfigModule } from './modules/config/app-config.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    AppConfigModule,
    DatabaseModule,
    CloudinaryModule,
    ProductsModule,
    CategoriesModule,
  ],
  providers: [CloudinaryService],
})
export class AppModule {}
