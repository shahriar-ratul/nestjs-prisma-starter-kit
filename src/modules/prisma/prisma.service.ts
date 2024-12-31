// biome-ignore lint/style/useImportType: <explanation>
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
        Logger.log('Prisma connected');
    }
}

// const findAll = async (userId: String) => {
//   const query: Prisma.categoriesFindManyArgs = {
//     where: {
//       user_id: userId,
//     }
//   };
//   const [categories, count] = await prisma.$transaction([
//     prisma.categories.findMany(query),
//     prisma.categories.count({ where: query.where })
//   ]);

//   return {
//     pagination: {
//       total: count
//     },
//     data: categories
//   };
// };
