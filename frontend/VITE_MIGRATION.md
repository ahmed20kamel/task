# التحويل إلى Vite - Vite Migration Guide

## لماذا Vite أفضل من Create React App؟

### ✅ مزايا Vite:
1. **أسرع بكثير**: Vite يستخدم ES modules مباشرة في التطوير، لذلك لا يحتاج إلى bundle كامل
2. **HMR سريع**: Hot Module Replacement فوري
3. **بناء أسرع**: يستخدم Rollup للبناء وليس webpack
4. **حجم أصغر**: لا يحتاج إلى كل webpack config
5. **أحدث التقنيات**: يدعم أحدث معايير JavaScript و TypeScript مباشرة

### ⚠️ لماذا استخدمنا Create React App؟
- **الأكثر شيوعاً**: الكثير من المطورين يعرفونه
- **ثبات أكبر**: تم اختباره على نطاق واسع
- **سهولة البدء**: يعمل مباشرة بدون إعداد إضافي
- **دعم أفضل**: مجتمع أكبر وموارد أكثر

## كيفية التحويل إلى Vite:

### الخطوة 1: تثبيت Vite
```bash
npm install -D vite @vitejs/plugin-react
```

### الخطوة 2: إنشاء ملف vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
```

### الخطوة 3: تحديث package.json
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### الخطوة 4: نقل index.html إلى root
```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>تطبيق إدارة المهام</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.js"></script>
  </body>
</html>
```

### الخطوة 5: تحديث index.js
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
```

### الخطوة 6: حذف react-scripts
```bash
npm uninstall react-scripts
```

## ملاحظات مهمة:

1. **API Calls**: تأكد من تحديث baseURL في api.js ليتوافق مع proxy
2. **Environment Variables**: في Vite تستخدم `import.meta.env` بدلاً من `process.env`
3. **Public Assets**: ضع الملفات في مجلد `public` مباشرة

## هل تريد التحويل الآن؟

إذا كنت تريد التحويل إلى Vite، يمكنني القيام بذلك الآن. سيكون التطبيق أسرع في التطوير!

