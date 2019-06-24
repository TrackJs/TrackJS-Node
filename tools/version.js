const fs = require("fs");
const git = require("simple-git");
const package = require("../package.json");

let _hash;
function getGitHash() {
  return new Promise((resolve, reject) => {
    if (_hash) {
      resolve(_hash);
    }
    git().revparse(["HEAD"], (error, data) => {
      if (error) {
        reject("Could not get hash", error);
      }
      _hash = data.trim();
      resolve(_hash);
    });
  });
}

function writeVersionInfo(files) {
  return Promise.all(
    (files || []).map(file => {
      return new Promise((resolve, reject) => {
        if (!fs.existsSync(file)) {
          return reject(file + " does not exist.");
        }

        fs.readFile(file, "utf8", (error, data) => {
          if (error) {
            return reject(error);
          }
          getGitHash()
            .then(hash => {
              let newFileContent = data
                .replace(/%HASH%/g, hash)
                .replace(/%VERSION%/g, package.version)
                .replace(/%NAME%/g, package.name);
              fs.writeFile(file, newFileContent, "utf8", error => {
                if (error) {
                  return reject(error);
                }
                resolve();
              });
            })
            .catch(err => reject);
        });
      });
    })
  );
}

writeVersionInfo(["./dist/version.js"])
  .then(() => {
    console.log("version complete");
    process.exit(0);
  })
  .catch(error => {
    console.error("version failed", error);
    process.exit(1);
  });
