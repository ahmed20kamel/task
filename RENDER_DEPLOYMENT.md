# دليل النشر على Render - Render Deployment Guide

## إعدادات Render

### Backend (Django)

**في Render Dashboard:**

1. **New Web Service**
2. **Connect your repository**
3. **Settings:**
   - **Name:** `task-app-backend`
   - **Environment:** `Python 3`
   - **Build Command:** `cd backend && ./build.sh` أو `cd backend && pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate`
   - **Start Command:** `cd backend && gunicorn taskapp.wsgi:application --bind 0.0.0.0:$PORT`
   - **Root Directory:** `backend`

4. **Environment Variables:**
   - `SECRET_KEY`: أنشئ مفتاح سري قوي (يمكنك استخدام: `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`)
   - `DEBUG`: `False` (للإنتاج)
   - `ALLOWED_HOSTS`: `task-x00b.onrender.com,localhost,127.0.0.1`
   - `DATABASE_URL`: (إذا كنت تستخدم PostgreSQL على Render)

### Frontend (React)

**في Render Dashboard:**

1. **New Static Site**
2. **Connect your repository**
3. **Settings:**
   - **Name:** `task-app-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

4. **Environment Variables:**
   - `REACT_APP_API_URL`: `https://task-x00b.onrender.com/api`

## ملفات مطلوبة

### 1. `backend/build.sh`
```bash
#!/usr/bin/env bash
# exit on error
set -o errexit

pip install --upgrade pip
pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
```

### 2. `backend/runtime.txt`
```
python-3.11.0
```

### 3. `backend/Procfile` (اختياري)
```
web: gunicorn taskapp.wsgi:application --bind 0.0.0.0:$PORT
```

## المشاكل الشائعة والحلول

### Error 500 في Backend:

**الأسباب المحتملة:**
1. Database migrations لم تتم
2. Missing dependencies
3. Environment variables غير محددة

**الحل:**
1. تأكد من أن `build.sh` يحتوي على `python manage.py migrate`
2. تحقق من logs في Render Dashboard
3. تأكد من أن جميع المتطلبات في `requirements.txt`

### CORS Errors:

**الحل:**
- تأكد من `CORS_ALLOW_ALL_ORIGINS = True` في `settings.py`
- أضف Frontend URL إلى `CORS_ALLOWED_ORIGINS`

### Database Issues:

**إذا كنت تستخدم PostgreSQL على Render:**
1. أنشئ PostgreSQL database في Render
2. أضف `DATABASE_URL` إلى Environment Variables
3. حدّث `settings.py` لاستخدام PostgreSQL:

```python
import dj_database_url

DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),
        conn_max_age=600
    )
}
```

## التحقق من الإعداد

1. **Backend:**
   - افتح: `https://task-x00b.onrender.com/api/`
   - يجب أن ترى JSON response مع endpoints

2. **Frontend:**
   - افتح: `https://task-1-uljf.onrender.com`
   - يجب أن يعمل التطبيق ويتم الاتصال بالـ Backend

## نصائح مهمة

1. ✅ استخدم Environment Variables للـ SECRET_KEY
2. ✅ اضبط `DEBUG = False` في الإنتاج
3. ✅ استخدم PostgreSQL بدلاً من SQLite في الإنتاج
4. ✅ فعّل WhiteNoise للـ static files
5. ✅ راجع Logs في Render Dashboard عند حدوث أخطاء

