import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ItemModule } from './item/item.module';
import { CategoryModule } from './category/category.module';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './files/files.module';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CartModule } from './cart/cart.module';
import { ScheduleModule } from '@nestjs/schedule';
import { OrderModule } from './order/order.module';
import * as process from 'process';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    UserModule,
    AuthModule,
    ItemModule,
    CategoryModule,
    FilesModule,
    CartModule,
    OrderModule,
  ],
})
export class AppModule {}
