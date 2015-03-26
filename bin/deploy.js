var argv = require("yargs").argv
  , newPath = argv.d
  , fs = require("fs")
  , p = require("path")
  , io = require("../utils/io")
  , _ = require("lodash")
  , currentPath = p.join(process.cwd(), "build/");

var files = io.listAllFiles(currentPath);

if (!io.exists(newPath)) {
  io.makeDir(newPath);
  console.log('Build folder created !');
}

files.map(function(file) {
  fs.renameSync(currentPath, newPath);
  console.log([file, 'was moved to ', newPath].join());
})

console.log('files moved to deploy succesfully');

