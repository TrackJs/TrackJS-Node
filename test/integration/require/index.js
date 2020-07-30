const express = require("express");
const { TrackJS } = require('../../../dist');

console.log('Starting Require Test...');

TrackJS.install({
  token: '8de4c78a3ec64020ab2ad15dea1ae9ff',
  console: { enabled: false },
  onError: function(payload) {

    if (!payload.environment.dependencies.express) {
      console.log("failed to discover dependencies", payload.environment.dependencies);
      process.exit(1);
      return false;
    }

    console.log('Require Tests PASSED');
    process.exit(0);
    return false;
  }
});

TrackJS.track("test");
