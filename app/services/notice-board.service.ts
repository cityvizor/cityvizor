import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class NoticeBoardService {

	cache = {
		entities: null
	};
	
	constructor(private _http: Http) {
	}

	parseXMLBoards(string){
		var parser = new DOMParser();
		var DOM = parser.parseFromString(string, "text/xml");
		var output = {
			"dashboards":[],
			"nuts3":[],
			"nuts4":[]
		};
		
		var nuts3_index = {};
		var nuts4_index = {};
		
		var dashboards = DOM.documentElement.getElementsByTagName("dashboard");
		var document;

		for(var i = 0; i < dashboards.length; i++){
			
			var nuts3 = dashboards[i].getAttribute("nuts3_id");
			var nuts4 = dashboards[i].getAttribute("nuts4_id");
			
			output.dashboards.push({
				"id": dashboards[i].getAttribute("edesky_id") * 1,
				"name": dashboards[i].getAttribute("name"),
				"nuts3": dashboards[i].getAttribute("nuts3_id"),
				"nuts4": dashboards[i].getAttribute("nuts4_id")
			});
			
			if(!nuts3_index[nuts3]){
				nuts3_index[nuts3] = {
					"id": nuts3 * 1,
					"name": dashboards[i].getAttribute("nuts3_name")
				};
				output.nuts3.push(nuts3_index[nuts3]);
			}
			
			if(!nuts4_index[nuts4]){
				nuts4_index[nuts4] = {
					"id": nuts4 * 1,
					"nuts3": nuts3,
					"name": dashboards[i].getAttribute("nuts4_name")
				};
				output.nuts4.push(nuts4_index[nuts4]);
			}
			
		}
		
		return output;
	}

	parseXMLList(string){
		var parser = new DOMParser();
		var DOM = parser.parseFromString(string, "text/xml");
		var output = [];
		
		var documents = DOM.documentElement.getElementsByTagName("document");
		var document,attachments;

		for(var i = 0; i < documents.length; i++){
			var dS = documents[i].getAttribute("created_at");
			dS = dS.slice(0, 10) + "T" + dS.slice(11, 19) + dS.slice(20,27);
			var d = new Date(Date.parse(dS));
			document = {
				"id": documents[i].getAttribute("edesky_id"),
				"title": documents[i].getAttribute("name"),
				"date": d.toLocaleString(),
				"url": documents[i].getAttribute("orig_url")
			};

			output.push(document);
		}
		
		return output;
	}

	getBoards(){
		var url = "/api/uredni-desky";

		return this._http.get(url).toPromise()
			.then(response => response.text())
			.then(response => this.parseXMLBoards(response));
	}


	getList(id, filter, page){
		var url = "/api/uredni-desky/" + id;

		return this._http.get(url).toPromise()
			.then(response => response.text())
			.then(response => this.parseXMLList(response));
	}

	getPreview(documentId){
		var url = "/api/uredni-desky/preview/" + documentId;

		return this._http.get(url).toPromise()
			.then(response => response.text());
	};


	

}