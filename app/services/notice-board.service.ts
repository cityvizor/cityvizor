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
		/*var oDOM = oParser.parseFromString(sMyString, "text/xml");
		console.log(oDOM.documentElement.nodeName);
		return {};*/
	}


	getList(id, filter, page){

		return new Promise<any[]>((resolve,reject) => {
			var endpoint = "https://edesky.cz/api/v1/documents";
			var params = [
				["order","date"],
				["search","sql"],
				["page",page ? page : 1],
				["dashboard_id",id]
			];

			if(filter && filter.keywords) params.push(["keywords",filter.keywords]);
			if(filter && filter.dateFrom) params.push(["created_from",filter.dateFrom]);

			var url = endpoint + "?" + params.map(item => item[0] + "=" + item[1]).join("&");

			this._http.get(url).toPromise()
				.then(response => response.text())
				.then(response => this.parseXML(response));

		});
	}

	

}