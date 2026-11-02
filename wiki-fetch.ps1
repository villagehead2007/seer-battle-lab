[Console]::InputEncoding = [System.Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$ErrorActionPreference='Stop'
try {
  $wikiUrl=[Console]::In.ReadToEnd().Trim()
  $parsed=[uri]$wikiUrl
  if($parsed.Scheme -ne 'https' -or $parsed.Host -ne 'wiki.biligame.com' -or $parsed.AbsolutePath -ne '/seer/api.php'){throw 'Invalid Wiki endpoint'}
  $response=Invoke-WebRequest -Uri $wikiUrl -TimeoutSec 25 -UserAgent 'SeerBattleLab/0.6 (personal battle simulator; read-only MediaWiki client)' -Headers @{Accept='application/json'} -SkipHttpErrorCheck
  $body=$null
  if([int]$response.StatusCode -eq 200){$text=$response.Content; if($text -is [byte[]]){$text=[System.Text.Encoding]::UTF8.GetString($text)}; $body=ConvertFrom-Json -InputObject $text -Depth 100}
  $result=@{status=[int]$response.StatusCode; retryAfter=($response.Headers['Retry-After'] -join ''); body=$body}
  [Console]::Out.Write(($result | ConvertTo-Json -Depth 100 -Compress))
} catch { [Console]::Error.Write('Wiki transport failed: '+$_.Exception.Message); exit 1 }
