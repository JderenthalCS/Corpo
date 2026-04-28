<div align="center">
  <img src="src/img/logoAccent.png" alt="Corpo Logo" width="200"/>
</div>

<h1 align="center"><b>Corpo</b></h1>

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-AI-blue?style=for-the-badge)

</div>

<p align="center">
  🏆 1st Place Hackathon Winner
</p>

<p align="center">
  A contract clarity platform that transforms dense legal agreements into clear summaries, risk insights, and financial breakdowns.
</p>

---

## 📚 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [How it Works](#how-it-works)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Contributors](#contributors)
- [Acknowledgments](#acknowledgments)

---

## Overview

Corpo was built to solve a simple problem:

> Most people sign contracts they don’t fully understand.

Corpo analyzes leases, loans, and agreements and converts them into:
- Plain-English summaries  
- Risk indicators  
- Financial breakdowns  

---

## Features

- **Plain-English Summaries** — Simplifies complex legal language  
- **Risk Flagging System** — Highlights clauses as green, yellow, or red  
- **Predatory Score (0–100)** — Quantifies contract risk  
- **Financial Breakdown** — Visualizes total cost over time  
- **Report Storage** — Saves and organizes past analyses  
- **Drag & Drop Upload** — Simple document ingestion  

---

## Tech Stack

### Frontend
- React + Vite  
- TailwindCSS  
- React Router  
- Recharts  

### Backend
- FastAPI (Python)  
- Gemini API (LLM document analysis)  

### Database & Auth
- Supabase (PostgreSQL, Auth, Storage)

---

## How it Works

1. User uploads a contract  
2. Backend processes text and sends it to Gemini  
3. AI extracts:
   - Summary  
   - Key clauses  
   - Risk indicators  
4. Financial logic calculates long-term cost  
5. Results are stored and displayed with charts  

---

## Installation

### Prerequisites
- Node.js 18+  
- Python 3.10+  
- Supabase project  
- Gemini API key  

---

### Quick Start

```bash
git clone https://github.com/JderenthalCS/Corpo.git
cd corpo
npm install
npm run dev
```

---

## Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## Project Structure

```bash
corpo/
├── src/
├── backend/
├── public/
├── .env
├── vite.config.js
└── README.md
```

---


# Contributors
<table align="center"> <tr> <td align="center"> <a href="https://github.com/JderenthalCS"> <img src="https://github.com/JderenthalCS.png" width="100px;" /><br /> <sub><b>Justin Derenthal</b></sub><br /> <sub>Full-Stack / AI</sub> </a> </td> <td align="center"> <a href="https://github.com/ryguy0601"> <img src="https://github.com/ryguy0601.png" width="100px;" /><br /> <sub><b>Ryan</b></sub><br /> <sub>Frontend / Design</sub> </a> </td> </tr> </table>

---

## Acknowledgments
Logo designed & UI insight by [Dylan Berkowitz](https://www.linkedin.com/in/dylan-berkowitz-862958334/)

