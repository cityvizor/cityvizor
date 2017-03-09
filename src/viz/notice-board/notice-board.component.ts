import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { YQLService } from '../../services/yql.service';
import { ToastService } 		from '../../services/toast.service';

import {Http} from '@angular/http';

@Component({
	moduleId: module.id,
	selector: 'notice-board',
	templateUrl: 'notice-board.template.html',
	styleUrls: ['notice-board.style.css']
})
export class NoticeBoardComponent {
	// decides which part (vizualization, map or list) will be shown
	show: string = 'map';

	@Input()
	set profile(profile) {
		if(profile && this.profileId !== profile._id){
			this.profileId = profile._id;
			
			this.mapURL = this.sanitizer.bypassSecurityTrustResourceUrl("http://mapasamospravy.cz/embed?q[lau_id_eq]=" + profile.entity.mapasamospravy + "#14/" + profile.entity.gps[1] + "/" + profile.entity.gps[0]);
			
			this.yql.query("select documents from xml where url = 'https://edesky.cz/api/v1/documents?dashboard_id=" + profile.entity.edesky + "&order=date&search_with=sql&page=1'")
				.then(data => data.query.results.edesky_search_api.documents.document)
				.then(documents => this.documents = documents);
		}
	}

	profileId;

	infoWindowClosed:boolean;

	mapURL: SafeResourceUrl;

	documents: Array<any>;

	constructor(private yql:YQLService, private sanitizer:DomSanitizer) {
	}

}