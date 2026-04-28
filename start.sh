#!/bin/bash

source backend/venv/bin/activate
echo "✓ Activated backend venv"

cd backend
python -m uvicorn main:app --reload &

cd ..
npm install && npm run dev