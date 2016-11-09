import { Component, Input } from '@angular/core';

import { NoticeBoardService } from '../../services/notice-board.service';
import { ToastService } 		from '../../services/toast.service';

@Component({
	moduleId: module.id,
	selector: 'notice-board',
	templateUrl: 'notice-board.template.html',
	styles: [``]
})
export class NoticeBoardComponent {

	@Input()
	set data(data) {
		if(data && data.id !== this.id){
			this.id = data.id;
			this.loadList({},1);
		}
	};
	
	 id: number;
	 list: Array<any>;

	 constructor(private _nbs: NoticeBoardService, private _toastService: ToastService) {

	 }

	 loadList(filter,page){		
		 if(!this.id) return;
		 
		 
		 var loadingToast = this._toastService.toast("Načítám data z eDesky.cz...", "loading", false); 

		 this._nbs.getList(this.id,filter,page).then(data => {
			 this.list = data;			 
			 loadingToast.hide();
		 });
	 }

	}