import { Component, Input } from '@angular/core';

import { NoticeBoardService } from '../../services/notice-board.service';
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
	set data(data) {
		if(data && data.id !== this.id){
			this.id = data.id;
			this.loadList({},1);
		}
	};
	
	 id: number;
	 list: Array<any>;

	 constructor(private _nbs: NoticeBoardService, private _toastService: ToastService, private _http: Http) {

	 }

	 loadList(filter,page){		
		 if(!this.id) return;
		 
		 
		 var loadingToast = this._toastService.toast("Načítám data z eDesky.cz...", "loading", false); 

		 this._nbs.getList(this.id,filter,page).then(data => {
			 
			 data.forEach(document => {
				 document.preview = null;
				 document.showPreview = false;
			 });
			 
			 this.list = data;			
			 
			 loadingToast.hide();
		 });
	 }
	 
	 openPreview(document){
		 document.showPreview = true;
		 document.preview = "Načítám...";
		 this._nbs.getPreview(document.id)
			 .then(preview => document.preview = preview)
			 .catch(err => document.preview = "Nastala chyba při načítání.");
	 }
	 
	 linkEDesky(document){
	 }
	 linkdDocument(document){
	 }

	}