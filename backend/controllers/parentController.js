const prisma = require('../prismaClient');

const getChildren = async (req, res) => {
  try {
    const parentId = req.user.id;
    const links = await prisma.parentChild.findMany({
      where: { parentId },
      include: {
        child: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            class: true,
            school: true,
            streak: true,
            tier: true,
            lastActive: true,
          },
        },
      },
    });

    res.json(links.map(l => l.child));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching children' });
  }
};

const getChildActivity = async (req, res) => {
  try {
    const { id: childId } = req.params;
    const parentId = req.user.id;

    // Verify parent has access to this child
    const link = await prisma.parentChild.findUnique({
      where: { parentId_childId: { parentId, childId } },
    });

    if (!link) return res.status(403).json({ message: 'Access denied' });

    const child = await prisma.user.findUnique({
      where: { id: childId },
      include: {
        progress: { include: { lesson: true }, take: 10, orderBy: { updatedAt: 'desc' } },
        attempts: { take: 10, orderBy: { date: 'desc' } },
      },
    });

    res.json(child);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching child activity' });
  }
};

const linkChild = async (req, res) => {
  try {
    const { childEmail } = req.body;
    const parentId = req.user.id;

    const child = await prisma.user.findUnique({ where: { email: childEmail } });
    if (!child) return res.status(404).json({ message: 'Student not found' });

    const link = await prisma.parentChild.create({
      data: { parentId, childId: child.id },
    });

    res.status(201).json(link);
  } catch (error) {
    res.status(500).json({ message: 'Error linking child' });
  }
};

module.exports = { getChildren, getChildActivity, linkChild };
