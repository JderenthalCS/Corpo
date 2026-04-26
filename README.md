# Corpo

A contract clarity platform that turns dense legal agreements into plain-English summaries, risk flags, and visual cost breakdowns.

## What it does

Upload any lease, loan, or contract and Corpo will:

- Generate a plain-English summary of the document
- Flag green, yellow, and red risk clauses
- Calculate a predatory score from 0–100
- Show a full financial impact breakdown with charts
- Store all reports in one searchable place

## Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS
- React Router
- Recharts

**Backend**
- Supabase (database, auth, storage)
- FastAPI (Python)
- Gemini (AI document analysis)

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- A Supabase project
- An Gemini API key

### Frontend Setup

```bash
git clone https://github.com/JderenthalCS/Corpo.git
cd corpo
npm install
npm run dev
```

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Create a `.env` file in the backend folder:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
OPENAI_API_KEY=your_openai_api_key
```

## Project Structure

```
corpo/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── img/
│   │   ├── logoBlack.png
│   │   ├── logoWhite.png
│   │   └── logoAccent.png
│   ├── lib/
│   │   ├── supabaseClient.js
│   │   └── theme.js
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── UploadPage.jsx
│   │   ├── ReportsPage.jsx
│   │   ├── ReportDetailPage.jsx
│   │   ├── AccountPage.jsx
│   │   └── AuthPage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── backend/
│   ├── main.py
│   └── requirements.txt
├── .env
├── index.html
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon public key |
| `SUPABASE_SERVICE_KEY` | Your Supabase service role key (backend only) |
| `OPENAI_API_KEY` | Your OpenAI API key |

## Features

- **Risk Flagging** — Catches hidden penalties and unfair obligations
- **Cost Timeline** — Visualizes total cost over the life of a contract
- **Report Archive** — Stores and indexes every analysis
- **Theme Support** — Dark, light, and system theme modes
- **Drag and Drop** — Simple file upload experience

## License

MIT
