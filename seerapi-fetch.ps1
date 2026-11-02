[Console]::InputEncoding = [System.Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$ErrorActionPreference='Stop'
try {
  $wikiUrl=[Console]::In.ReadToEnd().Trim()
  $parsed=[uri]$wikiUrl
  if($parsed.Scheme -ne 'https' -or $parsed.Host -ne 'api.seerapi.com' -or $parsed.AbsolutePath -notmatch '^/v1/(pet|skill|skill_effect_type|element_type|element_type_combination|soulmark)/?([0-9]+)?$'){throw 'Invalid Wiki endpoint'}
  # Windows PowerShell/.NET Schannel can fail the API TLS handshake in the
  # restricted runtime; curl uses the host TLS stack and is the supported
  # fallback for the same read-only request.
  $curl = Get-Command curl.exe -ErrorAction SilentlyContinue
  if($curl){
    $raw = & $curl.Source '--silent' '--show-error' '--max-time' '25' '--user-agent' 'SeerBattleLab/0.8 (personal battle simulator; read-only data client)' '--header' 'Accept: application/json' $wikiUrl 2>$null
    if($LASTEXITCODE -ne 0){throw 'SeerAPI HTTPS 请求失败（curl TLS/连接错误）'}
    $body=ConvertFrom-Json -InputObject (($raw -join "`n")) -Depth 100
    $result=@{status=200;retryAfter='';body=$body}
    [Console]::Out.Write(($result | ConvertTo-Json -Depth 100 -Compress)); exit 0
  }
  $params=@{Uri=$wikiUrl;TimeoutSec=25;UserAgent='SeerBattleLab/0.8 (personal battle simulator; read-only data client)';Headers=@{Accept='application/json'};SkipHttpErrorCheck=$true}
  if($env:SEER_PROXY){$params.Proxy=$env:SEER_PROXY}
  $response=Invoke-WebRequest @params
  $body=$null
  if([int]$response.StatusCode -eq 200){$text=$response.Content; if($text -is [byte[]]){$text=[System.Text.Encoding]::UTF8.GetString($text)}; $body=ConvertFrom-Json -InputObject $text -Depth 100}
  if($body -and $parsed.AbsolutePath -match '/skill_effect_type/'){ $body.PSObject.Properties.Remove('skill'); $body.PSObject.Properties.Remove('tag') }
  $result=@{status=[int]$response.StatusCode; retryAfter=($response.Headers['Retry-After'] -join ''); body=$body}
  [Console]::Out.Write(($result | ConvertTo-Json -Depth 100 -Compress))
} catch { [Console]::Error.Write('Wiki transport failed: '+$_.Exception.Message); exit 1 }
