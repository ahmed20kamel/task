# حل المشاكل الشائعة - Troubleshooting Guide

## المشاكل التي تم إصلاحها ✅

### 1. تحذيرات ESLint:
- ✅ تم إزالة الـ imports غير المستخدمة (Badge, NotificationsIcon, Alert, Button, TextField)
- ✅ تم إصلاح مشاكل useEffect dependencies
- ✅ تم إزالة الدوال غير المستخدمة (getStatusColor, getStatusLabel)

### 2. مشاكل Pip Dependencies:
التحذيرات التالية **ليست خطيرة** ولا تمنع التطبيق من العمل:
```
django-eventstream 5.3.1 requires Django>=5
drf-nested 1.3.3 requires djangorestframework>=3.16.0
drf-nested-routers 0.94.2 requires djangorestframework>=3.15.0
```

**الحل**: هذه المكتبات غير مستخدمة في المشروع الحالي، يمكن تجاهلها.

إذا أردت إزالتها:
```bash
pip uninstall django-eventstream drf-nested drf-nested-routers
```

### 3. مشكلة 404 في Django:
```
Not Found: /
Not Found: /favicon.ico
```

**هذا طبيعي!** Django API لا يحتوي على صفحة رئيسية على `/`. 
افتح `http://localhost:8000/api/` أو `http://localhost:3000` للواجهة الأمامية.

## مشاكل محتملة وحلولها

### Frontend لا يتصل بـ Backend:

**المشكلة**: رسائل خطأ في console عن فشل الاتصال

**الحل**:
1. تأكد أن Backend يعمل على `http://localhost:8000`
2. تأكد أن CORS مفعل في `backend/taskapp/settings.py`
3. تحقق من `frontend/src/services/api.js` - يجب أن يكون baseURL صحيحاً

### مشاكل Token Authentication:

**المشكلة**: 401 Unauthorized

**الحل**:
1. تحقق من أن Token محفوظ في localStorage
2. تأكد من إرسال Token في headers:
   ```javascript
   Authorization: Token <your-token>
   ```

### مشاكل Database:

**المشكلة**: `No such table` أو أخطاء migrations

**الحل**:
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### مشاكل npm install:

**المشكلة**: أخطاء أثناء التثبيت

**الحل**:
```bash
# حذف node_modules وإعادة التثبيت
rm -rf node_modules package-lock.json
npm install
```

## نصائح للتحسين

### 1. استخدام Virtual Environment للـ Python:
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```

### 2. استخدام .env للـ Environment Variables:
إنشاء ملف `.env` في backend:
```
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
```

### 3. إضافة Error Boundary في React:
لحماية التطبيق من الأخطاء غير المتوقعة.

### 4. إضافة Loading States:
لتحسين تجربة المستخدم أثناء تحميل البيانات.

## الدعم

إذا واجهت أي مشاكل أخرى، تأكد من:
1. ✅ تحقق من أن جميع المتطلبات مثبتة
2. ✅ تحقق من logs في console وterminal
3. ✅ تأكد من أن الخوادم تعمل على المنافذ الصحيحة
4. ✅ تأكد من تحديث المتصفح (Ctrl+F5)

