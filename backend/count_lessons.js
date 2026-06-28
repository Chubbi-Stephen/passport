const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function main() {
  const n = await p.lesson.count();
  console.log('Lessons in DB:', n);
}
main().catch(console.error).finally(() => p.$disconnect());
