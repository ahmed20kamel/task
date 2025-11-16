# دليل استخدام نظام الترجمة واللغات

## ✅ ما تم إضافته:

### 1. إصلاح RTL (Right-to-Left):
- ✅ دعم كامل للعربية من اليمين لليسار
- ✅ تحديث تلقائي للاتجاه عند تغيير اللغة
- ✅ استخدام `stylis-plugin-rtl` لـ Material-UI

### 2. الألوان البرتقالية:
- ✅ إضافة `orange` color للثيم:
  - `orange.main`: `#ff9800`
  - `orange.light`: `#ffb74d`
  - `orange.dark`: `#f57c00`
- ✅ تحسين `warning` color أيضاً

### 3. نظام الترجمة (i18n):
- ✅ دعم العربية والإنجليزية
- ✅ ملفات الترجمة: `ar.json` و `en.json`
- ✅ مكون تبديل اللغة في شريط التنقل
- ✅ حفظ اختيار اللغة في localStorage

## 📦 المكتبات المطلوبة:

```bash
cd frontend
npm install i18next react-i18next stylis stylis-plugin-rtl @emotion/cache
```

## 🎨 استخدام الألوان البرتقالية:

```jsx
// في Component
<Button sx={{ bgcolor: 'orange.main', color: 'orange.contrastText' }}>
  زر برتقالي
</Button>

// أو
<Chip color="warning" label="Warning Chip" />
```

## 🌐 استخدام الترجمة:

```jsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return <Typography>{t('auth.login')}</Typography>;
};
```

## 🔄 تبديل اللغة:

- اضغط على أيقونة اللغة في شريط التنقل
- اختر العربية أو English
- سيتم تحديث التطبيق فوراً

## 📝 إضافة ترجمات جديدة:

1. افتح `frontend/src/i18n/locales/ar.json`
2. افتح `frontend/src/i18n/locales/en.json`
3. أضف الترجمات بنفس المفتاح في كلا الملفين
4. استخدم `t('your.key')` في الكود

## ⚙️ التخصيص:

### تغيير اللغة الافتراضية:
في `frontend/src/i18n/index.js`:
```javascript
lng: localStorage.getItem('language') || 'ar', // غير 'ar' إلى 'en'
```

### إضافة لغات جديدة:
1. أنشئ ملف `fr.json` في `locales/`
2. أضف في `i18n/index.js`:
```javascript
import frTranslations from './locales/fr.json';
// ...
resources: {
  // ...
  fr: { translation: frTranslations },
}
```

