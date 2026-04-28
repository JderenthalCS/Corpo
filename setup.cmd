@echo off

echo Creating .env...
echo #VITE_SUPABASE_URL=> .env
echo #VITE_SUPABASE_ANON_KEY=>> .env
echo [OK] Created .env

echo Creating backend\.env...
(
    echo GEMINI_API_KEY=
    echo SUPABASE_URL=
    echo SUPABASE_SERVICE_ROLE_KEY=
) > backend\.env
echo [OK] Created backend\.env

echo Creating venv in backend\venv...
python -m venv backend\venv
echo [OK] Created venv in backend\venv

echo Installing dependencies...
backend\venv\Scripts\pip install -r requirements.txt
echo [OK] Installed dependencies in backend\venv