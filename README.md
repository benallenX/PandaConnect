# PandaConnect

**PandaConnect** is a modern, role-based web app designed to streamline communication between teachers and parents. Built with Next.js, Clerk, Convex, and Tailwind CSS, it empowers educators to share classroom moments, events, and updates securely in real time.

---

## 🧠 Purpose
> PandaConnect aims to provide a secure, easy-to-use platform for schools to improve parent-teacher communication. It helps educators manage student updates, events, and classroom media, while ensuring parents stay informed and engaged in their child's education.

---

## 🚀 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Auth**: Clerk (RBAC: admin, teacher, parent)
- **Backend**: Convex (real-time serverless functions & storage)
- **Storage**: Convex blob storage (for images)
- **Styling**: Tailwind CSS + ShadCN UI
- **Analytics**: Tinybird (real-time usage dashboards)
- **Testing**: Playwright (E2E), Cucumber-style specs

---

## 📦 Features

### ✅ Teacher Dashboard
- Upload and tag student photos
- Create and manage class events
- Send messages to parents

### ✅ Parent Dashboard
- View photos tagged to their children
- Read messages from teachers
- See upcoming events

### ✅ Admin Dashboard
- View user activity
- Access analytics via Tinybird

---

## 📊 Analytics
All key interactions (uploads, views, messages, logins) are streamed to **Tinybird** to power a public dashboard with real-time engagement metrics.

> _"Built like a real product. Measured like a real product."_

---

## 🛠️ Local Setup
```bash
# 1. Clone
npm install

# 2. Configure .env.local
CLERK_SECRET_KEY=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CONVEX_DEPLOY_KEY=...
TINYBIRD_API_TOKEN=...

# 3. Start Dev Server
npm run dev
```

---

## ✅ Roadmap (Job-Ready Scope)
- [x] Students + parent linking
- [x] Messaging module
- [x] Gallery with filters and download
- [x] Events calendar (simple form)
- [x] Tinybird metrics tracking
- [x] Role-based route groups
- [x] Admin dashboard stub
- [x] E2E test: photo → parent view

---

## 🙋‍♂️ Built By
**Ben Allen** — Full-stack developer focused on scalable, secure web applications with a product-first mindset.

---

## 📸 Screenshots / Live Demo (Optional)
> Add deployment link, dashboard preview, and screen captures here.
