const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding subjects...');

  const subjects = [
    { name: 'Mathematics', code: 'MATH' },
    { name: 'English Language', code: 'ENG' },
    { name: 'Biology', code: 'BIO' },
    { name: 'Physics', code: 'PHY' },
    { name: 'Chemistry', code: 'CHM' },
    { name: 'Economics', code: 'ECO' },
    { name: 'Government', code: 'GOV' },
    { name: 'Literature in English', code: 'LIT' },
    { name: 'Christian Religious Studies', code: 'CRS' },
  ];

  for (const s of subjects) {
    await prisma.subject.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
