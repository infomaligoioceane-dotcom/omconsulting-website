/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['jsx', 'js'],
};

module.exports = nextConfig;
```

5. Cliquez **"Commit"**

---

### **Créez aussi `pages/index.jsx`**

1. Cliquez **"Add file"** → **"Create new file"**
2. Chemin complet : `pages/index.jsx`
3. Copiez **TOUT** le contenu de `oceane-consulting-with-ai.jsx` dedans
4. Cliquez **"Commit"**

---

### **Créez le dossier `api/`**

1. Cliquez **"Add file"** → **"Create new file"**
2. Chemin complet : `api/chat.js`
3. Copiez le contenu de votre `api-chat.js`
4. Cliquez **"Commit"**

---

## 🔄 Vercel redéploie automatiquement

Une fois que vous avez commité, Vercel va :
1. Détecter les changements sur GitHub
2. Recompiler automatiquement
3. Redéployer (~2 min)

Attendez 2-3 minutes et **rechargez la page** ! ✅

---

## 📋 Structure finale (ce qu'il faut avoir sur GitHub)
```
omconsulting-website/
├── pages/
│   └── index.jsx                    ← Votre composant React
├── api/
│   └── chat.js                      ← Backend API
├── public/
│   └── (vide, c'est ok)
├── package.json
├── next.config.js                   ← À créer
├── tsconfig.json                    ← À créer (voir ci-dessous)
├── .env.example
├── vercel.json
├── supabase-setup.sql
└── Les guides .md
