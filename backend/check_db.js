const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.question.count();
  const subjects = await prisma.subject.findMany({ include: { _count: { select: { questions: true } } } });
  
  console.log('--- DATABASE REPORT ---');
  console.log('Total Questions:', count);
  console.log('Subjects found:', subjects.map(s => `${s.name} (${s._count.questions})`).join(', '));
  console.log('-----------------------');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
