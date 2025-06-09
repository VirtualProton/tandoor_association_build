import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {fullName: "Pritham Biswas", phone: "9652314406",role: 'ADMIN'},
      { fullName: "Badal", phone: "1234567890", role: 'TSMWA_EDITOR' },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
