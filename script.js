// تحميل إعدادات الموقع من settings.json وعرضها في الصفحة
fetch('settings.json')
  .then(res => res.json())
  .then(data => {
    document.getElementById('boost-image').src = data.image;
    document.getElementById('price').innerText = data.price;
  });

// إرسال الطلب وحفظه في orders.json + إرسال لتليجرام (اختياري)
document.getElementById('order-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const formData = new FormData(this);

  const order = {
    serverLink: formData.get('serverLink'),
    paymentMethod: formData.get('paymentMethod'),
    paymentProof: formData.get('paymentProof'),
    notes: formData.get('notes'),
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  fetch('orders.json')
    .then(res => res.json())
    .then(orders => {
      orders.push(order);
      return fetch('orders.json', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orders)
      });
    })
    .then(() => {
      alert('تم إرسال الطلب بنجاح');
      location.reload();
    });
});
