const prisma = require('../prismaClient');

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          include: {
            results: { orderBy: { createdAt: 'desc' }, take: 5 }
          }
        }
      },
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      user: {
        firstName: user.firstName || user.name || 'Student',
        streak: user.studentProfile?.streak || 0,
        points: user.studentProfile?.points || 0,
        tier: user.tier || 'FREE',
      },
      recentAttempts: user.studentProfile?.results || [],
      overallProgress: 0, // Placeholder until lessons table is re-added
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};

const getLessons = async (req, res) => {
  try {
    const lessons = await prisma.lesson.findMany({
      include: { subject: true },
      orderBy: [{ week: 'asc' }, { order: 'asc' }],
    });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lessons' });
  }
};

const updateProgress = async (req, res) => {
  try {
    const { id: lessonId } = req.params;
    const { completed, percentage } = req.body;
    const userId = req.user.id;

    const progress = await prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { completed, percentage },
      create: { userId, lessonId, completed, percentage },
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress' });
  }
};

const getPracticeQuestions = async (req, res) => {
  try {
    const { subjectId, subject, year, topic } = req.query;
    
    let subId = subjectId;
    if (!subId && subject) {
      const sub = await prisma.subject.findFirst({ 
        where: { 
          name: { equals: subject } 
        } 
      });
      if (sub) subId = sub.id;
    }

    const questions = await prisma.question.findMany({
      where: {
        ...(subId && { subjectId: subId }),
        ...(year && { year: parseInt(year) }),
        ...(topic && { topic }),
      },
      include: { subject: true },
      take: 50,
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions' });
  }
};

const startExamSession = async (req, res) => {
  try {
    const { subjectId, examType = 'JAMB', questionCount = 40 } = req.body;
    const userId = req.user.id;

    // Get or Create student profile (Self-healing)
    let student = await prisma.studentProfile.findUnique({ where: { userId } });
    
    if (!student) {
      console.log(`Creating missing profile for user ${userId}`);
      student = await prisma.studentProfile.create({
        data: { userId }
      });
    }

    // Create a new session
    const session = await prisma.examSession.create({
      data: {
        studentId: student.id,
        subjectId: subjectId,
        examType: examType,
      },
    });

    // Fetch randomized questions for this subject
    const questions = await prisma.$queryRawUnsafe(
      `SELECT * FROM Question WHERE subjectId = '${subjectId}' ORDER BY RANDOM() LIMIT ${parseInt(questionCount)}`
    );

    res.json({
      sessionId: session.id,
      questions: questions.map(q => ({
        ...q,
        options: [q.optionA, q.optionB, q.optionC, q.optionD],
      }))
    });
  } catch (error) {
    console.error('Start Exam Error:', error);
    res.status(500).json({ message: 'Error starting exam session', error: error.message });
  }
};

const finishExamSession = async (req, res) => {
  try {
    const { sessionId, responses } = req.body; // responses: [{ questionId, selectedOption }]
    const userId = req.user.id;

    const session = await prisma.examSession.findUnique({ 
      where: { id: sessionId },
      include: { results: true }
    });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    let correctCount = 0;
    const totalCount = responses.length;

    // Process each response
    const student = await prisma.studentProfile.findUnique({ where: { userId } });

    for (const resp of responses) {
      const q = await prisma.question.findUnique({ where: { id: resp.questionId } });
      const isCorrect = q.correctOption === resp.selectedOption;
      if (isCorrect) correctCount++;

      await prisma.studentResponse.create({
        data: {
          studentId: student.id,
          questionId: resp.questionId,
          selectedOption: resp.selectedOption,
          isCorrect: isCorrect
        }
      });
    }

    const scorePercentage = (correctCount / totalCount) * 100;

    // Save final result
    const result = await prisma.examResult.create({
      data: {
        studentId: student.id,
        sessionId: sessionId,
        score: scorePercentage,
        correct: correctCount,
        total: totalCount
      }
    });

    // --- SMARTER STREAK LOGIC ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActive = new Date(student.lastActive);
    lastActive.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(today - lastActive);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let newStreak = student.streak;

    if (diffDays === 1) {
      // Perfect! Yesterday was active, today is a new day.
      newStreak += 1;
    } else if (diffDays > 1) {
      // Oh no, they missed a day. Reset to 1.
      newStreak = 1;
    } else if (student.streak === 0) {
      // First time ever? Start at 1.
      newStreak = 1;
    }
    // If diffDays === 0, they already boosted their streak today. Keep it the same.

    // Award Points & Update Streak
    const pointsAwarded = Math.round(scorePercentage * 2);
    await prisma.studentProfile.update({
      where: { id: student.id },
      data: {
        points: { increment: pointsAwarded },
        streak: newStreak,
        lastActive: new Date()
      }
    });

    res.json({
      result,
      pointsAwarded,
      newStreak,
      message: 'Exam submitted successfully!'
    });

  } catch (error) {
    console.error('Finish Exam Error:', error);
    res.status(500).json({ message: 'Error submitting exam' });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const students = await prisma.studentProfile.findMany({
      include: {
        user: {
          select: { firstName: true, lastName: true, school: true, state: true }
        }
      },
      orderBy: { points: 'desc' },
      take: 20,
    });
    
    const formattedLeaderboard = students.map(s => ({
      id: s.id,
      firstName: s.user.firstName,
      lastName: s.user.lastName,
      school: s.user.school,
      state: s.user.state,
      points: s.points,
      streak: s.streak
    }));

    res.json(formattedLeaderboard);
  } catch (error) {
    console.error('Leaderboard Error:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
};

module.exports = {
  getDashboardData,
  getLessons,
  updateProgress,
  getPracticeQuestions,
  startExamSession,
  finishExamSession,
  getLeaderboard,
};
