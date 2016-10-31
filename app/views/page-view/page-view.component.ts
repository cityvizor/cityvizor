import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Http, HttpModule }     from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Component({
	moduleId: module.id,
  selector: 'page-view',
	templateUrl: 'page-view.template.html',
	styleUrls: ['page-view.style.css'],
})
export class PageViewComponent implements OnInit {
	
	pageId;
	pageContent;

	constructor(private route: ActivatedRoute, private http: Http) {
		
		
		
	}

	getPageContent(id){
		return this.http.get("/app/infopages/" + this.pageId + ".html").toPromise();
	}
	
	ngOnInit(){
		this.route.params.forEach((params: Params) => {
			this.pageId = params["id"];
			this.getPageContent(this.pageId)
				.then(res => this.pageContent = res.text(),err => console.log(err));
		});
	}


}