// 📁 server.js
// Express.js لتشغيل سكريبت boost.js تلقائيًا من خلال /run-boost

const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Endpoint لتشغيل boost.js
app.post('/run-boost', (req, res) => {
  exec('node boost.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error: ${error.message}`);
      return res.status(500).send('حدث خطأ أثناء تنفيذ boost.js');
    }
    if (stderr) {
      console.error(`⚠️ stderr: ${stderr}`);
    }
    console.log(`✅ Boost script output:\n${stdout}`);
    res.send('تم تشغيل boost.js بنجاح');
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
