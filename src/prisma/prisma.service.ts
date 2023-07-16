import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { prismaExclude } from 'prisma-exclude';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgresql://postgres:root@localhost:5432/online_store?schema=public',
        },
      },
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.$connect();
  }

  async onModuleInit(): Promise<void> {
    await this.$disconnect();
  }
}

export const exclude = prismaExclude(new PrismaService());
