const package = require("../package.json");

// Magic string for teamcity info.
// @see https://www.jetbrains.com/help/teamcity/build-script-interaction-with-teamcity.html
console.log('##teamcity[buildNumber \'' + package.version + '-build.{build.number}\']');
console.log('##teamcity[packageVersion \'' + package.version + '\']');
