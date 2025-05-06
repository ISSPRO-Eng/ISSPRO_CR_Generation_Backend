const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Allow CORS so your frontend on GitHub Pages can talk to this backend
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

// Handle file + form upload
app.post('/upload', upload.single('zipFile'), async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "matta@isspro.com', 'lucyw@isspro.com",
      subject: 'New quote request from isspro.com!',
      text: 'See attached ZIP file.',
      attachments: [
        {
          filename: req.file.originalname,
          path: req.file.path,
        },
      ],
    });

    res.status(200).send('Email sent successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Email failed to send.');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});