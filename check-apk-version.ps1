$OriginalPath = Get-Location

$envJson = @{}
$envFilePath = Join-Path $OriginalPath ".env.json"
if (Test-Path $envFilePath) {
  $envJson = Get-Content -Path $envFilePath -Raw | ConvertFrom-Json
}  else {
  Write-Host "Error: .env.json file not found."
  exit
}

Invoke-Expression "$($envJson.ANDROID_AAPT_PATH)/aapt.exe dump badging TurboNotes.apk"