# 🌐 EuronAI

Full-stack AI-powered platform built with **React.js frontend** and **Express.js (TypeScript) backend**, deployed on **Vercel**.  
The app integrates **Google Gemini**, **ClipDrop**, **Clerk (Auth)**, **Neon (Postgres)**, and **Cloudinary** to provide seamless AI-driven article generation, image editing, and resume review features.

🔗 **Repo:** [Euron.ai](https://github.com/jatinSangwan11/Euron.ai)

---

## 📂 Monorepo Structure

```
Euron.ai/
├── client/              # React.js frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/              # Express + TypeScript backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── configs/
│   ├── types/
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Tech Stack

### Frontend (client/)
- ⚛️ **React.js**
- 🎨 **Tailwind CSS**
- 🔑 **Clerk** (authentication UI)
- ⚡ REST API calls to backend

### Backend (server/)
- 🟦 **Express.js (TypeScript)**
- 🗄 **Neon/Postgres** (serverless DB)
- 🔑 **Clerk** (auth middleware)
- 🖼 **Cloudinary** (media storage)
- 🤖 **Google Gemini API** (via OpenAI SDK)
- 🎨 **ClipDrop API** (text-to-image, background/object removal)
- 📄 **PDF-parse** (resume analysis)
- ☁️ **Vercel** (deployment)

---

## 🔑 Environment Variables

Create **`.env`** in both `/client` and `/server` folders:

### `/server/.env`
```env
# Clerk
CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key

# Database
DATABASE_URL=your_neon_postgres_url

# AI Keys
GEMINI_API_KEY=your_gemini_api_key
CLIPDROP_API_KEY=your_clipdrop_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### `/client/.env`
```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_CLERK_PUBLISHABLE_KEY=your_key
```

---

## 🖥️ Local Development

### 1. Clone the repo
```bash
git clone https://github.com/jatinSangwan11/Euron.ai.git
cd Euron.ai
```

### 2. Install dependencies

Frontend:
```bash
cd client
npm install
```

Backend:
```bash
cd ../server
npm install
```

### 3. Run locally

Backend:
```bash
npm run start
```
Runs Express on **http://localhost:3000**

Frontend:
```bash
cd ../client
npm start
```
Runs React on **http://localhost:5173** (or CRA default `3000`)

---

## 📦 Deployment (Vercel)

The backend (`server`) is deployed as **Vercel serverless functions**.

`vercel.json` config:

```json
{
  "version": 2,
  "builds": [
    { "src": "api/index.ts", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/api" }
  ]
}
```

The frontend (`client`) can be deployed on **Vercel/Netlify** separately and pointed to the backend API URL.

---

## 🔥 Features

### ✍️ Content AI
- `/api/ai/generate-article` → Generate articles
- `/api/ai/generate-blog-title` → Generate blog titles

### 🖼 Image Tools
- `/api/ai/generate-image` → AI image generation (ClipDrop)
- `/api/ai/remove-background` → Background removal
- `/api/ai/remove-object` → Object removal

### 📄 Resume Review
- Upload a PDF → AI reviews it and provides feedback

### 👤 Auth & Users
- Powered by **Clerk** for secure sign-in/sign-up
- User metadata tracked (Free vs Premium usage)

---

## 🧪 Example API Request

```bash
curl -X POST https://your-vercel-domain.vercel.app/api/ai/generate-article   -H "Content-Type: application/json"   -d '{
    "prompt": "Write about the future of AI in healthcare",
    "length": 500
  }'
```

Response:
```json
{
  "success": true,
  "content": "AI is transforming healthcare by..."
}
```

---

## 🤝 Contribution

1. Fork the repo  
2. Create your feature branch  
   ```bash
   git checkout -b feature/new-feature
   ```
3. Commit your changes  
   ```bash
   git commit -m 'Add new feature'
   ```
4. Push to branch  
   ```bash
   git push origin feature/new-feature
   ```
5. Open a Pull Request 🎉

---

## 📜 License

MIT © 2025 [Jatin Sangwan](https://github.com/jatinSangwan11)
