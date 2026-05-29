const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- RESETTING DATABASE ---');
  
  // 1. Delete all relational data in order to avoid foreign key errors
  console.log('Clearing Exam Results...');
  await prisma.examResult.deleteMany({});
  
  console.log('Clearing Questions...');
  await prisma.question.deleteMany({});
  
  console.log('Clearing Topics...');
  await prisma.topic.deleteMany({});
  
  // 2. Re-verify Subjects (Ensure they exist)
  const defaultSubjects = [
    { name: 'Mathematics', code: 'MATH' },
    { name: 'English Language', code: 'ENG' },
    { name: 'Biology', code: 'BIO' },
    { name: 'Physics', code: 'PHY' },
    { name: 'Chemistry', code: 'CHM' }
  ];

  for (const s of defaultSubjects) {
     await prisma.subject.upsert({
       where: { name: s.name },
       update: {},
       create: s
     });
  }

  console.log('DONE: Database is now clean and ready for import.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
