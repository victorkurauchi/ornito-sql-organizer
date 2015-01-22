#!/usr/bin/env node
;(function(paths) {

	var argv = require("yargs").argv;
	var fs = require("fs");
	var p = require("path");
	var io = require("../utils/io");
	var _ = require("lodash");
	var path = argv.p;
	var out = p.join(process.cwd(), 'build/');
	
	if(!path){
		console.log("Ornito helper => *Be sure the scripts and the maps.json have the same name. Usage: node index.js --p path/to/your/scripts");
		return;
	}

  	var files = io.listAllFiles(path);
  	var maps = identifyMaps(files);

  	organize(maps, function(buffer){
  		
  		var content = _.union(buffer, files)
  			.map(function(file){
  				return io.readFile(file);
  			});

  		io.write(out + "bundle.sql", content, {enconding: "utf-8"}, function(){
  			console.log('Bundle created on:', out);
  		});
  	});

	function identifyMaps(files){
		return _.remove(files, function(item){
			return item.match(/(map.json)/g);
		}).map(function(item){
			return require(item);
		});
	}

	function loadDependencies(maps){
		var dependencies = [];
		maps.forEach(function(item){
			dependencies = _.union(dependencies, item.dependencies);
		});
		return dependencies;
	}

	function findInFiles(files, name){
		return files.filter(function(file){
			var filename = io.fileName(file, ".sql");
			return filename === name;
		})[0];
	}

	function organize(maps, cb){
		var buffer = [];
		maps.forEach(function(mapp){
	  		buffer = mapp.dependencies.map(function(dependency){
	  			return findInFiles(files, dependency);
	  		});
  		});
  		cb(buffer);
	}

})(process.argv.slice(2));