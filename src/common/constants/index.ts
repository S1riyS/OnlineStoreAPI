import { Prisma } from '@prisma/client';

export const simplifiedItemSelectObject: Prisma.ItemSelect = {
  id: true,
  name: true,
  image: true,
  price: true,
};
