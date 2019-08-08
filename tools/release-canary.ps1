#requires -version 4
<#
.SYNOPSIS Releases the agent to canary.  This is invoked by TeamCity after
  the build and tests have been completed.
.PARAMETER $Root Root directory of the project.
.PARAMETER $BuildNumber Current Build Count Number.
#>

Param (
  [string] $Root = $pwd,
  [Parameter(Mandatory)][string] $BuildNumber
)


# Check if the environment is compatible with the script
#############################################################################
if (-Not (Get-ChildItem -Path $Root\dist -Name package.json)) {
  Write-Error "package.json configuration missing from $Path"
  exit 1
}
if (-Not (Get-Command npm)) {
  Write-Error "Environment missing required command: npm"
  exit 1
}


try {
  Write-Output "TrackJS-Node Canary Release Starting..."

  # Publish to npm
  #############################################################################
  Write-Output "Publishing to npm"
  cd $Root
  & npm publish --tag canary
  if ($lastExitCode -ne 0) {
    Write-Error "Failed to publish to npm"
    exit 1;
  }
  cd $Root

  Write-Output "TrackJS-Node Canary Release Complete."
} catch {
  Write-Error $_.Exception.Message
  exit 1
}
