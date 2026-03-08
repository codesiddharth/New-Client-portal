# portal.ai — AI Freelancer Client Portal

A full-stack Next.js app with AI features powered by Claude.

---

## 🚀 Deploy to Vercel (5 Steps)

### Step 1 — Get Anthropic API Key
1. Go to https://console.anthropic.com
2. Sign up / log in
3. Click **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)

### Step 2 — Upload to GitHub
1. Go to https://github.com → **New repository**
2. Name it `portal-ai` → Create
3. Upload ALL these files (drag & drop the folder)

### Step 3 — Deploy on Vercel
1. Go to https://vercel.com → **Add New Project**
2. Import your `portal-ai` GitHub repo
3. Click **Deploy** (Vercel auto-detects Next.js)

### Step 4 — Add API Key to Vercel
1. In Vercel → your project → **Settings** → **Environment Variables**
2. Add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your key from Step 1
3. Click **Save**
4. Go to **Deployments** → click **Redeploy**

### Step 5 — Done! 🎉
Your app is live at `https://portal-ai-xxx.vercel.app`

---

## 📁 Project Structure

```
portal-ai/
├── app/
│   ├── layout.js          # Root HTML layout
│   ├── page.js            # Home page
│   ├── globals.css        # Global styles
│   └── api/claude/
│       └── route.js       # Secure API route for Claude
├── components/
│   └── Portal.js          # Main app component
├── lib/
│   └── data.js            # Sample data
├── .env.local.example     # Copy this to .env.local
├── next.config.js
└── package.json
```

## 💻 Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Create env file
cp .env.local.example .env.local
# Then add your API key to .env.local

# 3. Start dev server
npm run dev

# Open http://localhost:3000
```
