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
			var dS = documents[i].getAttribute("created_at");
			dS = dS.slice(0, 10) + "T" + dS.slice(11, 19) + dS.slice(20,27);
			var d = new Date(Date.parse(dS));
			document = {
				"id": documents[i].getAttribute("edesky_id"),
				"title": documents[i].getAttribute("name"),
				"date": d.toLocaleString(),
				"url": documents[i].getAttribute("orig_url")
			};
			/*
			attachments = documents[i].getElementsByTagName("attachment");
			for(var j = 0; j < attachments.length; j++){
				document.attachments.push({
					"title": attachments[j].getAttribute("name"),
					"mime": attachments[j].getAttribute("mimetype"),
					"url": attachments[j].getAttribute("orig_url")
				});
			}
			*/
			output.push(document);
		}
		
		return output;
	}


getList(id, filter, page){
	var url = "/api/uredni-desky/" + id;

	return this._http.get(url).toPromise()
		.then(response => response.text())
		.then(response => this.parseXML(response));
}

getPreview(documentId){
	var url = "/api/uredni-desky/preview/" + documentId;

	return this._http.get(url).toPromise()
		.then(response => response.text());
};


	

}