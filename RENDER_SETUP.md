# إعداد Render - Render Setup Guide

## إعداد Backend على Render

### 1. إنشاء Web Service:

1. اذهب إلى [Render Dashboard](https://dashboard.render.com)
2. اضغط **New +** → **Web Service**
3. **Connect your repository** (GitHub/GitLab/Bitbucket)
4. اختر Repository الخاص بك

### 2. إعدادات الخدمة:

**Basic Settings:**
- **Name:** `task-app-backend` (أو أي اسم تريده)
- **Environment:** `Python 3`
- **Region:** اختر أقرب region

**Build & Deploy:**
- **Root Directory:** `backend`
- **Build Command:** `chmod +x build.sh && ./build.sh` أو:
  ```
  pip install --upgrade pip && pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate
  ```
- **Start Command:** `gunicorn taskapp.wsgi:application --bind 0.0.0.0:$PORT`

### 3. Environment Variables:

أضف هذه المتغيرات في Render Dashboard → Environment:

```
SECRET_KEY=<your-secret-key-here>
DEBUG=False
ALLOWED_HOSTS=task-x00b.onrender.com,localhost,127.0.0.1
```

**لإنشاء SECRET_KEY:**
```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

**للحصول على DATABASE_URL (إذا كنت تستخدم PostgreSQL):**
- أنشئ PostgreSQL database في Render
- انسخ DATABASE_URL من Database settings
- أضفه إلى Environment Variables

### 4. PostgreSQL Database (موصى به):

1. **New +** → **PostgreSQL**
2. اختر الاسم والخطة
3. انسخ **Internal Database URL** أو **External Database URL**
4. أضفها كـ `DATABASE_URL` في Environment Variables

---

## إعداد Frontend على Render

### 1. إنشاء Static Site:

1. اذهب إلى Render Dashboard
2. اضغط **New +** → **Static Site**
3. **Connect your repository**

### 2. إعدادات الخدمة:

**Basic Settings:**
- **Name:** `task-app-frontend`
- **Root Directory:** `frontend`

**Build Settings:**
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `build`

### 3. Environment Variables:

```
REACT_APP_API_URL=https://task-x00b.onrender.com/api
```

**مهم:** استبدل `task-x00b.onrender.com` بـ URL Backend الخاص بك على Render!

---

## التحقق من الإعداد

### 1. Test Backend API:

افتح في المتصفح:
```
https://task-x00b.onrender.com/api/
```

يجب أن ترى:
```json
{
  "message": "Task Management API",
  "version": "1.0",
  "status": "running",
  "endpoints": {
    "auth": "/api/auth/",
    "tasks": "/api/tasks/",
    "notifications": "/api/notifications/",
    "admin": "/admin/"
  }
}
```

### 2. Test Frontend:

افتح:
```
https://task-1-uljf.onrender.com
```

يجب أن يعمل التطبيق ويتم الاتصال بالـ Backend.

---

## حل المشاكل الشائعة

### Error 500 في Backend:

**التحقق:**
1. افتح **Logs** في Render Dashboard
2. ابحث عن خطأ في الـ logs
3. تأكد من أن migrations تمت: `python manage.py migrate`

**الحلول الشائعة:**
- تأكد من أن `SECRET_KEY` محددة
- تأكد من أن `DATABASE_URL` صحيحة (إذا كنت تستخدم PostgreSQL)
- تأكد من أن جميع المتطلبات في `requirements.txt`

### CORS Errors:

**الحل:**
- تأكد من `CORS_ALLOW_ALL_ORIGINS = True` في `settings.py`
- أو أضف Frontend URL إلى `CORS_ALLOWED_ORIGINS`

### Frontend لا يتصل بالـ Backend:

**الحل:**
1. تأكد من `REACT_APP_API_URL` في Frontend Environment Variables
2. تأكد من أن URL صحيح: `https://your-backend-url.onrender.com/api`
3. افتح Console في المتصفح وابحث عن أخطاء

### Database Issues:

**إذا كنت تستخدم SQLite:**
- SQLite قد لا يعمل بشكل جيد على Render
- استخدم PostgreSQL بدلاً من ذلك

**إذا كنت تستخدم PostgreSQL:**
- تأكد من أن `DATABASE_URL` صحيحة
- تأكد من أن migrations تمت

---

## ملاحظات مهمة

1. ✅ **SECRET_KEY:** يجب أن تكون فريدة وقوية
2. ✅ **DEBUG:** اضبط على `False` في الإنتاج
3. ✅ **Database:** استخدم PostgreSQL في الإنتاج
4. ✅ **Environment Variables:** تأكد من إضافة جميع المتغيرات
5. ✅ **Logs:** راجع Logs في Render Dashboard عند حدوث أخطاء

---

## بعد النشر

1. ✅ اختبر Backend API في المتصفح
2. ✅ اختبر Frontend
3. ✅ حاول تسجيل مستخدم جديد
4. ✅ راجع Logs إذا حدثت أخطاء

---

## Links مفيدة

- [Render Documentation](https://render.com/docs)
- [Django on Render](https://render.com/docs/deploy-django)
- [React on Render](https://render.com/docs/deploy-create-react-app)

