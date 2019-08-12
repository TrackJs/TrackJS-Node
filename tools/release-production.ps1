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
if (-Not (Get-ChildItem -Path $Root -Name package.json)) {
  Write-Error "package.json configuration missing from $Path"
  exit 1
}
if (-Not (Get-Command npm)) {
  Write-Error "Environment missing required command: npm"
  exit 1
}


try {
  Write-Output "TrackJS-Node Production Release Starting..."

  # Get package.json build information for release
  #############################################################################
  $Package = Get-Content "$Root/package.json" -raw | ConvertFrom-Json
  $PackageVersion = $Package.version
  Write-Output "Updating package version to $PackageVersion"
  Write-Output "##teamcity[buildNumber '$PackageVersion']"

  # Publish to npm
  #############################################################################
  Write-Output "Publishing to npm"
  & npm publish $Root --tag latest
  if ($lastExitCode -ne 0) {
    Write-Error "Failed to publish to npm"
    exit 1;
  }

  Write-Output "TrackJS-Node Production Release Complete."
} catch {
  Write-Error $_.Exception.Message
  exit 1
}
