import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const id = "cmj04r4nk00061084ugnf5ncc"; 

  const user = await prisma.user.findUnique({
    where: { id },
    include: { nutritionistProfile: true },
  });

  if (!user) {
    console.log("User not found.");
    return;
  }

  console.log("User:", user);

  if (!user.nutritionistProfile) {
    console.log("Nutritionist profile DOES NOT EXIST for this user.");
  } else {
    console.log("Nutritionist PROFILE FOUND:", user.nutritionistProfile);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  prisma.$disconnect();
});
