const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /api/admin/import-questions
router.post('/import-questions', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { subjectId, examType } = req.body;

    // Parse the Excel/CSV file from buffer
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    console.log(`Received ${data.length} questions for subject: ${subjectId}`);

    let importCount = 0;
    
    // Process questions in a loop
    for (const row of data) {
      // Fuzzy header matching helper
      const getVal = (r, keys) => {
        const foundKey = Object.keys(r).find(k => 
          keys.some(key => k.toLowerCase().trim() === key.toLowerCase())
        );
        return foundKey ? r[foundKey] : null;
      };

      const questionText = getVal(row, ['Question', 'text', 'q', 'question']);
      const optA = getVal(row, ['A', 'optionA', 'option A', 'choice A', 'A.']);
      const optB = getVal(row, ['B', 'optionB', 'option B', 'choice B', 'B.']);
      const optC = getVal(row, ['C', 'optionC', 'option C', 'choice C', 'C.']);
      const optD = getVal(row, ['D', 'optionD', 'option D', 'choice D', 'D.']);
      const ansKey = getVal(row, ['Answer', 'correct', 'correctOption', 'ans', 'answer']);
      const topicName = getVal(row, ['Topic', 'topic', 'category']) || 'General';
      const expl = getVal(row, ['Explanation', 'explanation', 'exp', 'reason', 'expl']);
      const yr = parseInt(getVal(row, ['Year', 'year', 'yr'])) || 2024;
      const diff = getVal(row, ['Difficulty', 'difficulty', 'level']) || 'MEDIUM';

      // Find or create the topic first
      let topic = null;
      if (topicName) {
        topic = await prisma.topic.upsert({
          where: {
            subjectId_name: {
              subjectId: subjectId,
              name: String(topicName)
            }
          },
          update: {},
          create: {
            name: String(topicName),
            subjectId: subjectId
          }
        });
      }

      // Create the question with standardized names
      await prisma.question.create({
        data: {
          text: String(questionText || ''),
          optionA: String(optA || ''),
          optionB: String(optB || ''),
          optionC: String(optC || ''),
          optionD: String(optD || ''),
          correctOption: String(ansKey || 'A').trim().toUpperCase().charAt(0),
          explanation: String(expl || ''),
          year: yr,
          examType: examType || 'JAMB',
          difficulty: String(diff).toUpperCase(),
          subjectId: subjectId,
          topicId: topic ? topic.id : null
        }
      });
      
      importCount++;
    }

    res.json({ 
      message: 'Import successful', 
      count: importCount 
    });

  } catch (error) {
    console.error('Import Error:', error);
    res.status(500).json({ 
      message: 'Failed to import questions', 
      error: error.message 
    });
  }
});

// GET /api/admin/subjects (Helper to get IDs for the selector)
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany();
    if (subjects.length === 0) {
      return res.json([
        { id: 'math-123', name: 'Mathematics' },
        { id: 'eng-123', name: 'English Language' },
        { id: 'bio-123', name: 'Biology' },
      ]);
    }
    res.json(subjects);
  } catch (error) {
    console.error('Database connection failed, using fallback subjects');
    // Fallback data so the UI remains usable
    res.json([
      { id: 'math-123', name: 'Mathematics' },
      { id: 'eng-123', name: 'English Language' },
      { id: 'bio-123', name: 'Biology' },
    ]);
  }
});

module.exports = router;
