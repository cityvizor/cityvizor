const Transform = require('stream').Transform;

var proj4 = require("proj4");

module.exports = new Transform({
		objectMode: true,
		transform: function(entity, encoding, callback) {
			
			if(!entity["ZUJ"]){
				callback();
				return;
			}
			
			var openHours = {};
			
			var regexp = /([a-zA-ZÚřČá,\.]+)\:? ?([0-9\.\:]+)\-([0-9\.\:]+)(, ?([0-9\.\:]+)\-([0-9\.\:]+))?/g;

			var match;
			while(match = regexp.exec(entity["UREDNI_HODINY"])){

				
				var days = match[1].split(",");
				var from = match[2].replace(".",":");
				var to = match[3].replace(".",":");

				days.forEach(day => {
					
					day = day.replace(".","");
					
					var replaceSrc = ["Po","Út","St","Čt","Pá","So","Ne","Stř"];
					var replaceDst = ["mo","tu","we","th","fr","sa","su","we"];
					
					var i = replaceSrc.indexOf(day);
					if(i < 0) return;
					
					day = replaceDst[i];
					
					replaceSrc.forEach((srcName,i) => {
						day = day.replace(srcName,replaceDst[i]);
					});
					
					openHours[day] = [];
					openHours[day].push({
						"from": from,
						"to": to
					});
					
					if(match[4] && match[5] && match[5]){
						var from2 = match[5].replace(".",":");
						var to2 = match[6].replace(".",":");
						openHours[day].push({
							"from": from2,
							"to": to2
						});
					}
					
				});
				
			}
			
			var gps = [
				entity["SX"] ? entity["SX"].replace(",",".") : null,
				entity["SY"] ? entity["SY"].replace(",",".") : null
			];
			
			var fromProjection = "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=3500000 +y_0=0 +ellps=krass +towgs84=26,-121,-78 +units=m +no_defs"; // S-42  -  http://spatialreference.org/ref/sr-org/6636/
			var toProjection = "WGS84";
			
			gps = proj4(fromProjection,toProjection,gps);
			
			var data = {
				"_id": entity["ZUJ"],
				"name": entity["NAZEV_2"],
				"gps": gps,
				"phone": entity["TELEFON"],
				"email": entity["EMAIL"],
				"dataBox": entity["DATS"],
				"openHours": openHours,
				"ico": entity["ICO"],
				"address": {
					"street": entity["ULICE"],
					"streetNo": entity["CISLO_POPISNE"],
					"city": entity["MISTO"],
					"postalCode": entity["PSC"]
				}
			};
			
			
			callback(null,data);
		}
	});;