[Console]::InputEncoding = [System.Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$ErrorActionPreference='Stop'
try {
  $wikiUrl=[Console]::In.ReadToEnd().Trim()
  $parsed=[uri]$wikiUrl
  if($parsed.Scheme -ne 'https' -or $parsed.Host -ne 'raw.githubusercontent.com' -or $parsed.AbsolutePath -notmatch '^/SeerAPI/api-data/main/data/v1/data/(pet|skill|skill_effect_type|skill_hide_effect|element_type|element_type_combination|soulmark)/[0-9]+/index.json$'){throw 'Invalid Wiki endpoint'}
  $params=@{Uri=$wikiUrl;TimeoutSec=25;UserAgent='SeerBattleLab/0.8 (personal battle simulator; read-only data client)';Headers=@{Accept='application/json'};SkipHttpErrorCheck=$true}
  if($env:SEER_PROXY){$params.Proxy=$env:SEER_PROXY}
  $response=Invoke-WebRequest @params
  $body=$null
  if([int]$response.StatusCode -eq 200){$text=$response.Content; if($text -is [byte[]]){$text=[System.Text.Encoding]::UTF8.GetString($text)}; $body=ConvertFrom-Json -InputObject $text -Depth 100}
  if($body -and $parsed.AbsolutePath -match '/skill_effect_type/'){ $body.PSObject.Properties.Remove('skill'); $body.PSObject.Properties.Remove('tag') }
  $result=@{status=[int]$response.StatusCode; retryAfter=($response.Headers['Retry-After'] -join ''); body=$body}
  [Console]::Out.Write(($result | ConvertTo-Json -Depth 100 -Compress))
} catch { [Console]::Error.Write('Wiki transport failed: '+$_.Exception.Message); exit 1 }
