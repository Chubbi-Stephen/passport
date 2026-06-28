const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- RESETTING DATABASE ---');
  
  // 1. Delete all relational data in order to avoid foreign key errors
  console.log('Clearing Student Responses...');
  await prisma.studentResponse.deleteMany({});

  console.log('Clearing Exam Results...');
  await prisma.examResult.deleteMany({});

  console.log('Clearing Exam Sessions...');
  await prisma.examSession.deleteMany({});

  console.log('Clearing Progress...');
  await prisma.progress.deleteMany({});

  console.log('Clearing Lessons...');
  await prisma.lesson.deleteMany({});

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

  const subjectsMap = {};
  for (const s of defaultSubjects) {
     const createdSubject = await prisma.subject.upsert({
       where: { name: s.name },
       update: {},
       create: s
     });
     subjectsMap[s.name] = createdSubject.id;
  }

  // 3. Seed Default Lessons
  const lessonsData = [
    { subjectName: 'Biology', topic: 'Cell Division & Mitosis', duration: '24 min', views: 3420, week: 1, order: 1 },
    { subjectName: 'Biology', topic: 'Photosynthesis Explained', duration: '28 min', views: 2890, week: 1, order: 2 },
    { subjectName: 'Biology', topic: 'Human Digestive System', duration: '32 min', views: 2100, week: 2, order: 1 },
    { subjectName: 'Biology', topic: 'Genetics & Heredity', duration: '26 min', views: 1850, week: 2, order: 2 },
    
    { subjectName: 'Mathematics', topic: 'Quadratic Equations', duration: '30 min', views: 4120, week: 1, order: 1 },
    { subjectName: 'Mathematics', topic: 'Trigonometry Basics', duration: '35 min', views: 3670, week: 1, order: 2 },
    { subjectName: 'Mathematics', topic: 'Differentiation & Calculus', duration: '40 min', views: 2980, week: 2, order: 1 },
    
    { subjectName: 'Chemistry', topic: 'Organic Chemistry Intro', duration: '27 min', views: 2540, week: 1, order: 1 },
    { subjectName: 'Chemistry', topic: 'Acid-Base Reactions', duration: '22 min', views: 2110, week: 1, order: 2 },
    { subjectName: 'Chemistry', topic: 'Electrochemistry', duration: '31 min', views: 1640, week: 2, order: 1 },
    
    { subjectName: 'Physics', topic: 'Newton\'s Laws of Motion', duration: '25 min', views: 3890, week: 1, order: 1 },
    { subjectName: 'Physics', topic: 'Wave Properties', duration: '29 min', views: 2430, week: 1, order: 2 },
    
    { subjectName: 'English Language', topic: 'Summary Writing Techniques', duration: '20 min', views: 3200, week: 1, order: 1 },
    { subjectName: 'English Language', topic: 'Comprehension Strategies', duration: '18 min', views: 2780, week: 1, order: 2 }
  ];

  console.log('Seeding Lessons...');
  for (const l of lessonsData) {
    const subjectId = subjectsMap[l.subjectName];
    if (subjectId) {
      await prisma.lesson.create({
        data: {
          topic: l.topic,
          duration: l.duration,
          views: l.views,
          week: l.week,
          order: l.order,
          subjectId: subjectId
        }
      });
    }
  }

  console.log('DONE: Database is now clean and ready for import.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

