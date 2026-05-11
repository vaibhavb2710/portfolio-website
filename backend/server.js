
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio API running' });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New message from ${name} via Portfolio`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});




// Projects data

app.get('/api/projects', (req, res) => {
  res.json([
    {
      id: 1,
      title: 'AI Expense Analyzer',
      description: 'ML-powered expense classification with 92% accuracy. Uses OCR + NLP to extract receipt data, real-time analytics dashboard, anomaly detection alerts, and encrypted data storage.',
      tags: ['Python', 'ML', 'OCR', 'NLP', 'Flask'],
      metrics: ['92% accuracy', '80% effort reduction', '50+ categories'],
      date: 'Oct 2025',
    },
    {
      id: 2,
      title: 'n8n Workflow Popularity System',
      description: 'Automated data ingestion and scoring pipelines using n8n, processing hundreds of workflows daily. FastAPI REST services for popularity scores with event-driven automation.',
      tags: ['n8n', 'FastAPI', 'Python', 'REST API'],
      metrics: ['70% effort reduction', '100s workflows/day', 'Event-driven'],
      date: 'Nov 2025',
    },
    {
      id: 3,
      title: 'Campus Code Hub',
      description: 'Collaborative coding platform with gamified learning, problem posting, leaderboards and badges. Optimized backend APIs reducing response time by 25%.',
      tags: ['JavaScript', 'Node.js', 'MySQL', 'WebSockets'],
      metrics: ['30% engagement boost', '5000+ problems', '25% faster APIs'],
      date: 'Mar 2025',
    },
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
