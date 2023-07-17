import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ItemModule } from './item/item.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [UserModule, AuthModule, PrismaModule, ItemModule, CategoryModule],
})
export class AppModule {}
