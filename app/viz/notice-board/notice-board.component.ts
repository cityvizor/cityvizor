import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { NoticeBoardService } from '../../services/notice-board.service';
import { DataService } from '../../services/data.service';
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
			this._ds.getNoticeBoardIds(profile._id).then((ids) => {
				this.ids = ids;
				this.mapURL = this.sanitizer.bypassSecurityTrustResourceUrl("http://mapasamospravy.cz/embed?q[lau_id_eq]=" + ids.mapasamospravy);
			});
			this._nbs.getList(this.profileId,{},1).then(documents => this.documents = documents);
		}
	}
	
	ids: {
		"mapasamospravy": number,
		"edesky": number
	};
	profileId: string;	

	mapURL: SafeResourceUrl;

	documents: Array<any>;

	constructor(private _nbs: NoticeBoardService, private _ds: DataService, private sanitizer: DomSanitizer) {
	}

	openPreview(document){
		document.showPreview = true;
		document.preview = "Načítám...";
		this._nbs.getPreview(this.profileId,document.id)
			.then(preview => document.preview = preview)
			.catch(err => document.preview = "Nastala chyba při načítání.");
	}

	linkEDesky(document){
	}
	linkdDocument(document){
	}

}