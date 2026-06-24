# 🎓 مولّد البحث العلمي بالذكاء الاصطناعي

## خطوات النشر الكاملة

---

### المرحلة 1: تجهيز الأدوات (مرة واحدة فقط)

1. حمّل وثبّت **Node.js** من: https://nodejs.org (اختر LTS)
2. أنشئ حساباً على **GitHub**: https://github.com
3. أنشئ حساباً على **Vercel**: https://vercel.com (سجّل بحساب GitHub)
4. أنشئ حساباً على **Anthropic Console**: https://console.anthropic.com

---

### المرحلة 2: الحصول على مفتاح API

1. اذهب إلى https://console.anthropic.com
2. اضغط على **API Keys** من القائمة الجانبية
3. اضغط **Create Key** واحفظ المفتاح (يبدأ بـ sk-ant-)
4. أضف رصيداً (5 دولار تكفي للبداية)

---

### المرحلة 3: رفع الكود على GitHub

1. افتح Terminal أو CMD
2. انتقل إلى مجلد المشروع:
   ```
   cd research-app
   ```
3. ثبّت المكتبات:
   ```
   npm install
   ```
4. جرّب محلياً (اختياري):
   - انسخ .env.example إلى .env.local
   - ضع مفتاح API فيه
   - شغّل: npm run dev
5. ارفع على GitHub:
   ```
   git init
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin https://github.com/اسمك/research-app.git
   git push -u origin main
   ```

---

### المرحلة 4: النشر على Vercel

1. اذهب إلى https://vercel.com/dashboard
2. اضغط **Add New → Project**
3. اختر مستودع research-app من GitHub
4. في قسم **Environment Variables** أضف:
   - Name: `VITE_ANTHROPIC_API_KEY`
   - Value: مفتاح API الخاص بك
5. اضغط **Deploy** ✅

سيعطيك Vercel رابطاً مثل: `https://research-app.vercel.app`

---

### المرحلة 5: ربط نطاق خاص (اختياري)

1. اشترِ نطاقاً من Namecheap أو GoDaddy
2. في Vercel → Settings → Domains → أضف نطاقك
3. اضبط DNS كما يوضح Vercel

---

### المرحلة 6: إضافة مدونة لجلب الزوار

**الخيار الأفضل: WordPress على استضافة منفصلة**

1. اشترِ استضافة من **Hostinger** (أرخص خيار موثوق ~3$/شهر)
2. ثبّت WordPress بنقرة واحدة من لوحة التحكم
3. ثبّت قالب **Astra** أو **GeneratePress**
4. ثبّت إضافة **Yoast SEO**
5. ضع المدونة على: `blog.نطاقك.com`
6. اربطها بالتطبيق الرئيسي بزر "جرّب الأداة"

**موضوعات مقالات المدونة لجلب الزوار:**
- كيف تختار عنوان بحث ماجستير ناجح
- خطوات كتابة الإشكالية البحثية
- أفضل مناهج البحث العلمي لكل تخصص
- كيف تبني خطة بحث دكتوراه
- أخطاء شائعة في كتابة المذكرات الجامعية

---

## هيكل المشروع

```
research-app/
├── src/
│   ├── main.jsx      # نقطة الدخول
│   └── App.jsx       # التطبيق الرئيسي
├── index.html
├── vite.config.js
├── vercel.json
├── .env.example      # نموذج متغيرات البيئة
└── .gitignore
```
