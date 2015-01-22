#!/usr/bin/env node
;(function(paths) {

	var argv = require("yargs").argv;
	var fs = require("fs");
	var p = require("path");
	var io = require("../utils/io");
	var _ = require("lodash");
	var path = argv.p;
	var out = p.join(process.cwd(), "build");
	var TAG = "Script created by #ornito-sql-organizer on ";
	var COMMENT = "--";
	
	if(!path){
		console.log("Ornito helper => *Be sure the scripts and the maps.json have the same name. Usage: node index.js --p path/to/your/scripts");
		return;
	}

  	var files = io.listAllFiles(path);

  	organize(identifyMaps(files), function(buffer){
  			
		var content = _.union(buffer, files)
					.map(function(file){
						return io.readFile(file);
					});

		tag(content);

		io.write(out + "/bundle.sql"
			, content.join("\n\n")
			, {enconding: "utf-8"}
			, function(){
				console.log('Bundle created on:', out);
			});
	});

	function organize(maps, cb){
		var buffer = [];
		maps.forEach(function(mapp){
	  		buffer = mapp.dependencies.map(function(dependency){
	  			return findInFiles(files, dependency);
	  		});
  		});
  		cb(buffer);
	}

	function identifyMaps(files){
		return _.remove(files, function(item){
			return item.match(/(map.json)/g);
		}).map(function(item){
			return require(item);
		});
	}

	function findInFiles(files, name){
		return files.filter(function(file){
			var filename = io.fileName(file, ".sql");
			return filename === name;
		})[0];
	}

	function tag(content){
		content.unshift(COMMENT + TAG + new Date().toISOString());
	}

})(process.argv.slice(2));