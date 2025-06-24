const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ✅ قراءة settings
app.get('/settings.json', (req, res) => {
  fs.readFile('settings.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading settings');
    res.type('json').send(data);
  });
});

// ✅ حفظ settings
app.put('/settings.json', (req, res) => {
  fs.writeFile('settings.json', JSON.stringify(req.body, null, 2), (err) => {
    if (err) return res.status(500).send('Error saving settings');
    res.send('Settings saved');
  });
});

// ✅ قراءة التوكنات
app.get('/tokens.txt', (req, res) => {
  fs.readFile('tokens.txt', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading tokens');
    res.type('text').send(data);
  });
});

// ✅ حفظ التوكنات
app.put('/tokens.txt', (req, res) => {
  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', () => {
    fs.writeFile('tokens.txt', body, err => {
      if (err) return res.status(500).send('Error saving tokens');
      res.send('Tokens saved');
    });
  });
});

// ✅ قراءة الطلبات
app.get('/orders.json', (req, res) => {
  fs.readFile('orders.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading orders');
    res.type('json').send(data);
  });
});

// ✅ حفظ الطلبات
app.put('/orders.json', (req, res) => {
  fs.writeFile('orders.json', JSON.stringify(req.body, null, 2), (err) => {
    if (err) return res.status(500).send('Error saving orders');
    res.send('Orders updated');
  });
});

// ✅ تشغيل سكريبت البوست
app.post('/run-boost', (req, res) => {
  exec('node boost.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send('Error running boost script');
    }
    if (stderr) console.error(`stderr: ${stderr}`);
    console.log(`stdout: ${stdout}`);
    res.send('Boost script executed');
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
