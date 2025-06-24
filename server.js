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
app.use(express.static('public')); // لازم يكون فيه مجلد public

// ✅ تحديث الإعدادات
app.put('/settings.json', (req, res) => {
  fs.writeFileSync('settings.json', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// ✅ استرجاع الإعدادات
app.get('/settings.json', (req, res) => {
  const data = fs.readFileSync('settings.json', 'utf8');
  res.type('json').send(data);
});

// ✅ حفظ التوكنات
app.put('/tokens.txt', (req, res) => {
  fs.writeFileSync('tokens.txt', req.body);
  res.sendStatus(200);
});

// ✅ جلب التوكنات
app.get('/tokens.txt', (req, res) => {
  const tokens = fs.readFileSync('tokens.txt', 'utf8');
  res.type('text').send(tokens);
});

// ✅ الطلبات
app.get('/orders.json', (req, res) => {
  const data = fs.readFileSync('orders.json', 'utf8');
  res.type('json').send(data);
});

app.put('/orders.json', (req, res) => {
  fs.writeFileSync('orders.json', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// ✅ تشغيل سكريبت البوستات
app.post('/run-boost', (req, res) => {
  exec('node boost.js', (err, stdout, stderr) => {
    if (err) {
      console.error(stderr);
      return res.status(500).send('Error');
    }
    console.log(stdout);
    res.sendStatus(200);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
