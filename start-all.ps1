# Vibe Connect - Unified Startup Script
# Environment: Windows PowerShell

Write-Host "--- Launching Vibe Connect Unified Ecosystem ---" -ForegroundColor Cyan

# Define commands simply
$backendCmd = "cd 'e:\vibe connect\vibe-backend'; npm.cmd run dev"
$frontendCmd = "cd 'e:\vibe connect\vibe-connect'; npm.cmd run dev -- -p 3001"
$mcpCmd = "cd 'e:\vibe connect\stitch-mcp-server'; npm.cmd run inspector"

# 1. Start Vibe Backend
Write-Host "Starting Vibe Backend on port 5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd -WindowStyle Normal

# 2. Start Vibe Frontend
Write-Host "Starting Vibe Frontend on port 3001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd -WindowStyle Normal

# 3. Start Stitch MCP Server
Write-Host "Starting Stitch MCP Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", $mcpCmd -WindowStyle Normal

Write-Host "Done! All services initiated." -ForegroundColor Green
Write-Host "--------------------------------------------------"
Write-Host "Frontend: http://localhost:3001"
Write-Host "Backend:  http://localhost:5000"
Write-Host "--------------------------------------------------"
