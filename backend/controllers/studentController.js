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

const submitExam = async (req, res) => {
  try {
    const { score, total, duration, subjectBreakdown } = req.body;
    const userId = req.user.id;

    const attempt = await prisma.examAttempt.create({
      data: {
        userId,
        score,
        total,
        duration,
        subjectBreakdown: JSON.stringify(subjectBreakdown),
      },
    });

    res.json(attempt);
  } catch (error) {
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
    
    // Map the data to match the expected frontend format
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
  submitExam,
  getLeaderboard,
};
