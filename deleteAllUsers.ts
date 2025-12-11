// npx ts-node deleteAllUsers.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Delete all profiles first
  await prisma.adminProfile.deleteMany({});
  await prisma.clientProfile.deleteMany({});
  await prisma.nutritionistProfile.deleteMany({});

  // Delete users last
  await prisma.user.deleteMany({});

  console.log("All users and profiles deleted!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });