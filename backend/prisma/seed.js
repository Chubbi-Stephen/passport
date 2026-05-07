const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // Create Subjects
  const subjects = [
    { name: 'Mathematics', code: 'MATH' },
    { name: 'Biology', code: 'BIOL' },
    { name: 'Chemistry', code: 'CHEM' },
    { name: 'Physics', code: 'PHYS' },
    { name: 'English Language', code: 'ENGL' },
  ];

  for (const s of subjects) {
    await prisma.subject.upsert({
      where: { code: s.code },
      update: {},
      create: s,
    });
  }

  const math = await prisma.subject.findUnique({ where: { code: 'MATH' } });
  const biol = await prisma.subject.findUnique({ where: { code: 'BIOL' } });

  // Create Lessons
  await prisma.lesson.createMany({
    data: [
      { title: 'Quadratic Equations', subjectId: math.id, week: 1, order: 1, locked: false },
      { title: 'Trigonometry Basics', subjectId: math.id, week: 1, order: 2, locked: false },
      { title: 'Cell Division & Mitosis', subjectId: biol.id, week: 1, order: 1, locked: false },
      { title: 'Photosynthesis Explained', subjectId: biol.id, week: 1, order: 2, locked: false },
    ],
  });

  // Create Questions
  await prisma.question.createMany({
    data: [
      {
        text: 'If 2x + 3 = 11, what is the value of x?',
        options: JSON.stringify(['A. 3', 'B. 4', 'C. 5', 'D. 6']),
        answer: 'B',
        explanation: 'Solving: 2x + 3 = 11 -> 2x = 8 -> x = 4.',
        subjectId: math.id,
        year: 2023,
        topic: 'Algebra',
      },
      {
        text: 'Which organelle is known as the powerhouse of the cell?',
        options: JSON.stringify(['A. Nucleus', 'B. Ribosome', 'C. Mitochondria', 'D. Golgi body']),
        answer: 'C',
        explanation: 'Mitochondria produce ATP through cellular respiration.',
        subjectId: biol.id,
        year: 2023,
        topic: 'Cell Biology',
      },
    ],
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
