
<img width="768" height="512" alt="finnn" src="https://github.com/user-attachments/assets/82cea7d2-1a2c-42d8-86f5-d5357f705104" />

<h1 align="center">🏴‍☠️ FinPlay — Gamified Personal Finance Manager</h1>

<p align="center">
  <em>Loot the seas but bury your savings.</em><br/>
  FinPlay turns your daily transactions into an adventure of collectibles, savings jars, and achievements — making finance fun again.
</p>

<p align="center">
  <a href="https://fin-play-five.vercel.app/"><img src="https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge&logo=vercel" alt="Live Demo"/></a>
  <a href="https://github.com/NishuKaushik/FinPlay"><img src="https://img.shields.io/github/stars/NishuKaushik/FinPlay?style=for-the-badge" alt="GitHub stars"/></a>
  <a href="#"><img src="https://img.shields.io/github/last-commit/NishuKaushik/FinPlay?style=for-the-badge" alt="Last Commit"/></a>
</p>

---

## 🚀 Overview
**FinPlay** is a gamified web-based finance manager built using **React, Node.js, and MongoDB**.  
It reimagines personal finance with collectible cards, visual jars, and reward-based progress tracking.

🎯 **Goal:** Transform financial management from a chore into a rewarding experience.  
🌐 **Live:** [https://fin-play-five.vercel.app](https://fin-play-five.vercel.app)

---

## 🎮 Key Features

| Category | Description |
|-----------|-------------|
| 💸 **Transactions** | Add income and expenses — each becomes a collectible card. |
| 🪙 **Round-Up Savings** | Spare change is automatically added to your treasure jars. |
| ⚓ **Goal Jars** | Create multiple saving goals (Travel, Emergency, Tech). |
| 💳 **Bill Splitting** | Auto-calculate and settle group expenses. |
| 🏆 **Achievements** | Earn badges for streaks, milestones, and financial habits. |
| 🏴‍☠️ **Gamified Experience** | Pirate-themed UI with progress bars and evolving cards. |

---

## 🧭 Project Preview

| Module | Preview |
|--------|----------|
| **Dashboard** | Real-time overview of balance, savings, and progress |
| **Cards Gallery** | Collectible cards for each transaction and achievement |
| **Jars** | Animated jars representing user savings goals |
| **Achievements** | Pirate rank progression (Bronze Sailor → Gold Captain) |

---

## 🧩 Tech Stack
<p align="center">
  <img src="https://skillicons.dev/icons?i=react,nodejs,express,mongodb,vercel,git,github,html,css,javascript" />
</p>

<p align="center">
  <b>Frontend:</b> React.js (Vite), HTML5, CSS3, JavaScript<br/>
  <b>Backend:</b> Node.js, Express.js • <b>Database:</b> MongoDB Atlas<br/>
  <b>Auth:</b> JWT, bcrypt • <b>Deployment:</b> Vercel, Render
</p>


---
## 🏗️ Flow Summary:


<img width="1536" height="1024" alt="flow_overview" src="https://github.com/user-attachments/assets/13c1dfe9-4284-4479-b7ce-d9aec4b140aa" />

---
## ⚙️ Installation & Setup
Clone the repository
  ```
   git clone https://github.com/NishuKaushik/FinPlay.git
   cd FinPlay

```

Backend setup
 ```
cd backend
cp .env.example .env
npm install
npm run dev

```
Frontend setup
```
cd frontend
cp .env.example .env
npm install
npm start
```
## 🔧Environment Variables

| Variable      | Description                   |
| ------------- | ----------------------------- |
| `MONGO_URI`   | MongoDB connection string     |
| `JWT_SECRET`  | Secret key for authentication |
| `UPI_API_KEY` | (optional) Sandbox API key    |
| `PORT`        | Backend server port           |



## 🧱 Repository Structure
```
FinPlay/
 ├─ frontend/               # React Frontend
 ├─ backend/                # Node.js API Server
 ├─ docs/                   # Diagrams & Documentation
 │   ├─ ER_Diagram.png
 │   ├─ architecture.png
 │   ├─ dfd_lvl0.png
 │   ├─ FinPlay_Final_Documentation.docx
 │   └─ cover_finplay_banner.png
 ├─ .github/workflows/      # CI/CD pipelines
 ├─ LICENSE
 ├─ README.md
 └─ .gitignore
```

---
## 🔮 Future Enhancements

🧭 Native mobile app using React Native

💎 Real UPI integration & wallet tracking

🏁 Social savings challenges and leaderboards

🔔 AI-based spending insights

🌙 Dark mode toggle

---

## 🔐 Security Highlights

Role-based authentication (JWT)

Encrypted passwords (bcrypt)

Input sanitization and validation

Secure session handling via HTTP-only cookies

---

<p align="center"> Built with ❤️ by <a href="https://github.com/NishuKaushik">Nishu Kaushik</a><br/> <em>Because managing money shouldn’t be boring.</em> </p> 
