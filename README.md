# منصة الهندسة القيمية - EXPRO VE Platform

## خطوات النشر على Vercel

### الطريقة 1: GitHub + Vercel (الأسهل)

1. **أنشئ مستودع GitHub جديد:**
   - اذهب إلى github.com وسجل دخول
   - اضغط "New repository"
   - اسمه: `ve-platform`
   - اجعله Private أو Public

2. **ارفع الملفات:**
   - ارفع كل محتوى هذا المجلد إلى المستودع

3. **اربط Vercel:**
   - اذهب إلى vercel.com
   - اضغط "Add New Project"
   - اختر مستودع `ve-platform`
   - الإعدادات:
     - Framework: Create React App
     - Build Command: `npm run build`
     - Output Directory: `build`
   - اضغط Deploy

### الطريقة 2: Vercel CLI

```bash
npm install -g vercel
cd ve-platform
npm install
vercel --prod
```

## الميزات

- ✅ 7 خطوات تسلسلية لإدخال بيانات المشروع
- ✅ توليد التقرير بالذكاء الاصطناعي (Claude)
- ✅ تحرير التقرير مباشرة في المنصة
- ✅ تحميل التقرير بصيغة Word (.docx)
- ✅ جداول احترافية متوافقة مع EXPRO
- ✅ رأس وتذييل الصفحة في ملف Word
- ✅ ترقيم الصفحات تلقائياً
