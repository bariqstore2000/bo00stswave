const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.text());
app.use(express.static('public')); // مهم: مجلد الملفات

// ==== إعداد الملفات ====

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/order.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'order.html'));
});


// ==== إعداد البيانات الديناميكية ====

app.get('/settings.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'settings.json'));
});

app.put('/settings.json', (req, res) => {
  fs.writeFileSync('settings.json', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.get('/tokens.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'tokens.txt'));
});

app.put('/tokens.txt', (req, res) => {
  fs.writeFileSync('tokens.txt', req.body);
  res.sendStatus(200);
});

app.get('/orders.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'orders.json'));
});

app.put('/orders.json', (req, res) => {
  fs.writeFileSync('orders.json', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// ==== سكريبت البوست ====

app.post('/run-boost', (req, res) => {
  exec('node boost.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send('Boost failed');
    }
    res.send('Boost done');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
