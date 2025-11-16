# خطوات تثبيت المكتبات المطلوبة

## تثبيت المكتبات الجديدة:

```bash
cd frontend
npm install i18next react-i18next stylis stylis-plugin-rtl @emotion/cache
```

## المكتبات المطلوبة:
- `i18next` - مكتبة الترجمة الأساسية
- `react-i18next` - React wrapper لـ i18next
- `stylis` - CSS-in-JS preprocessor
- `stylis-plugin-rtl` - Plugin لدعم RTL
- `@emotion/cache` - لحفظ cache للـ styles

## بعد التثبيت:

1. شغّل التطبيق: `npm start`
2. ستجد أيقونة اللغة في شريط التنقل
3. اضغط عليها للتبديل بين العربية والإنجليزية
4. سيتم تحديث الاتجاه (RTL/LTR) تلقائياً

## ملاحظات:

- ✅ RTL يعمل بشكل صحيح الآن
- ✅ الألوان البرتقالية أضيفت للثيم (`orange` color)
- ✅ دعم كامل للغتين العربية والإنجليزية
- ✅ التطبيق يحفظ اختيار اللغة في localStorage

