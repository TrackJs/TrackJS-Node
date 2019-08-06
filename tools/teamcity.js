const package = require("../package.json");

// Magic string for teamcity info.
console.log('##teamcity[buildNumber \'' + package.version + '-build.{build.number}\']');
