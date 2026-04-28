#!/bin/bash

spin=('|' '/' '-' '\')

spinner() {
    local PID=$1
    local MSG=$2
    local i=0
    while kill -0 $PID 2>/dev/null; do
        printf "\r${spin[$i]} $MSG"
        i=$(( (i+1) % 4 ))
        sleep 0.1
    done
}

# making .env files for both frontend and backend with placeholders for the necessary environment variables
(echo "#VITE_SUPABASE_URL=" > .env && echo "#VITE_SUPABASE_ANON_KEY=" >> .env) &
spinner $! "Creating .env..."
printf "\r✓ Created .env\n"

(printf "GEMINI_API_KEY=\nSUPABASE_URL=\nSUPABASE_SERVICE_ROLE_KEY=\n" > backend/.env) &
spinner $! "Creating backend/.env..."
printf "\r✓ Created backend/.env\n"

# making a venv in the backend folder
python -m venv backend/venv &
spinner $! "Creating venv in backend/venv..."
printf "\r✓ Created venv in backend/venv\n"

# activate the venv and install dependencies
backend/venv/bin/pip install -r requirements.txt &
spinner $! "Installing dependencies..."
printf "\r✓ Installed dependencies in backend/venv\n"