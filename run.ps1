Set-ExecutionPolicy Bypass -Scope Process -Force

if (!(Test-Path "node_modules")) {
    npm install
}

# Start Backend in a new terminal
if ($IsMacOS) {
    $backendPath = Join-Path $PWD "backend"
    Start-Process osascript -ArgumentList "-e", "tell application ""Terminal"" to do script ""cd '$backendPath' && make start"""
} else {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; make run"
}

npm run dev
