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

	parseXML(string){
		var parser = new DOMParser();
		var DOM = parser.parseFromString(string, "text/xml");
		var output = [];
		
		var documents = DOM.documentElement.getElementsByTagName("document");
		var document,attachments;

		for(var i = 0; i < documents.length; i++){
			document = {
				"title": documents[i].getAttribute("name"),
				"date": new Date(documents[i].getAttribute("created_at")),
				"attachments": []
			};
			attachments = documents[i].getElementsByTagName("attachment");
			for(var j = 0; j < attachments.length; j++){
				document.attachments.push({
					"title": attachments[j].getAttribute("name"),
					"mime": attachments[j].getAttribute("mimetype"),
					"url": attachments[j].getAttribute("orig_url")
				});
			}
			output.push(document);
		}
		
		return output;
	}


	getList(id, filter, page){

		return new Promise<any[]>((resolve,reject) => {
			var url = "/api/uredni-desky/" + id;
			
			this._http.get(url).toPromise()
				.then(response => response.text())
				.then(response => this.parseXML(response))
				.then(data => resolve(data));
		});
	}

	

}