import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { FilesModule } from '../files/files.module';
import { SlugModule } from 'nestjs-slug';

@Module({
  imports: [FilesModule, SlugModule],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
