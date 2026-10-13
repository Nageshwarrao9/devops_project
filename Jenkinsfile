pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Install Dependencies') {
            steps { bat 'npm ci' }
        }
        stage('Test') {
            steps { bat 'npm test -- --runInBand' }
        }
        stage('Deploy') {
            steps {
                powershell '''
                $workspace = $env:WORKSPACE

                # Stop only a previous instance of this project.
                $oldApps = Get-CimInstance Win32_Process | Where-Object {
                    $_.Name -eq 'node.exe' -and $_.CommandLine -like "*$workspace*server.js*"
                }
                foreach ($app in $oldApps) {
                    Stop-Process -Id $app.ProcessId -Force -ErrorAction SilentlyContinue
                }

                $stdout = Join-Path $workspace 'app.log'
                $stderr = Join-Path $workspace 'app-error.log'
                Start-Process -FilePath 'node.exe' `
                    -ArgumentList 'server.js' `
                    -WorkingDirectory $workspace `
                    -RedirectStandardOutput $stdout `
                    -RedirectStandardError $stderr

                $ready = $false
                for ($i = 0; $i -lt 15; $i++) {
                    Start-Sleep -Seconds 2
                    try {
                        $response = Invoke-WebRequest -Uri 'http://localhost:3000/health' -UseBasicParsing -TimeoutSec 3
                        if ($response.StatusCode -eq 200) {
                            $ready = $true
                            Write-Host 'Application is running at http://localhost:3000'
                            Write-Host $response.Content
                            break
                        }
                    } catch {}
                }
                if (-not $ready) {
                    Write-Error 'Application did not start. Check app.log and app-error.log in the Jenkins workspace.'
                    if (Test-Path $stderr) { Get-Content $stderr }
                    exit 1
                }
                '''
            }
        }
    }
    post {
        success { echo 'Build and deployment succeeded. Open http://localhost:3000' }
        failure { echo 'Build or deployment failed. Check console output and app-error.log.' }
    }
}
