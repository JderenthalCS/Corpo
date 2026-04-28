@echo off

echo Activating backend venv...
call backend\venv\Scripts\activate.bat
echo [OK] Activated backend venv

echo Starting uvicorn...
start "uvicorn" cmd /k "cd backend && python -m uvicorn main:app --reload"

echo Starting frontend...
npm install && npm run dev