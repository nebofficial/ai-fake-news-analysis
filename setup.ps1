Set-ExecutionPolicy Bypass -Scope Process -Force

Write-Host "Checking Node.js..."
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js not found. Installing..."
    Invoke-WebRequest https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi -OutFile node.msi
    Start-Process msiexec.exe -Wait -ArgumentList "/i node.msi /quiet /norestart"
    Remove-Item node.msi
} else {
    Write-Host "Node.js already installed"
}

Write-Host "Checking Python..."
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "Python not found. Installing..."
    Invoke-WebRequest https://www.python.org/ftp/python/3.12.1/python-3.12.1-amd64.exe -OutFile python.exe
    Start-Process python.exe -Wait -ArgumentList "/quiet InstallAllUsers=1 PrependPath=1"
    Remove-Item python.exe
} else {
    Write-Host "Python already installed"
}

Write-Host "Refreshing PATH..."
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" +
            [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host "Verifying installations..."
node -v
python --version
pip --version

Write-Host "Setup complete. You can now run your project."
