// 📁 boost.js
// سكريبت تلقائي لتشغيل التوكنات على السيرفر المطلوب بعد قبول الطلب

const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  // قراءة الطلبات
  const orders = JSON.parse(fs.readFileSync('./orders.json'));
  const acceptedOrder = orders.find(order => order.status === 'accepted');
  if (!acceptedOrder) return console.log('لا يوجد طلب مقبول حاليًا');

  // قراءة رابط السيرفر المطلوب
  const serverInvite = acceptedOrder.serverLink.trim();

  // قراءة التوكنات
  const tokens = fs.readFileSync('./tokens.txt', 'utf-8')
    .split('\n')
    .map(t => t.trim())
    .filter(t => t);

  for (const token of tokens) {
    console.log(`🔁 محاولة دخول التوكن: ${token}`);
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('https://discord.com/login', { waitUntil: 'networkidle2' });

    await page.evaluate(token => {
      localStorage.setItem('token', `\"${token}\"`);
    }, token);

    await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });
    await page.waitForTimeout(3000);

    // الانتقال إلى رابط السيرفر المطلوب
    try {
      console.log(`➡️ دخول السيرفر: ${serverInvite}`);
      await page.goto(serverInvite, { waitUntil: 'networkidle2' });
      await page.waitForTimeout(5000);

      console.log('✅ تحقق إذا كانت هناك كابتشا...');
      // عند وجود كابتشا، المستخدم بيحل يدويًا
      await page.waitForSelector('iframe[src*="captcha"]', { timeout: 15000 });
      console.log('⚠️ تم اكتشاف كابتشا. برجاء الحل يدويًا...');
      await page.waitForTimeout(60000); // دقيقة انتظار لحل الكابتشا يدويًا

    } catch (err) {
      console.log('✅ التوكن دخل بدون كابتشا أو حصل خطأ: ' + err.message);
    }

    await browser.close();
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('🚀 تم تنفيذ جميع التوكنات');
})();
