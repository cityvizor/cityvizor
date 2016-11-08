import { Component, Input } from '@angular/core';

import { ToastService } 		from '../../services/toast.service';
import { DataService } 		from '../../services/data.service';

@Component({
	moduleId: module.id,
  selector: 'entity-admin',
	templateUrl: 'entity-admin.template.html',
	styleUrls: ['entity-admin.style.css'],
})
export class EntityAdminComponent {
	
	@Input()
	entity: any;	 
	 
	 dataString: string = "";
	 
	 modules = [
		 {"id": "informace","title": "Informace"},
		 {"id": "vydaje","title": "Výdaje"},
		 {"id": "prijmy","title": "Příjmy"},
		 {"id": "uredni-deska","title": "Úřední deska"},
		 {"id": "prezkum-hospodareni","title": "Přezkum hospodaření"}
	 ];

	constructor(private _ds: DataService, private _toastService: ToastService) {}
	 
	 setViewState(view: string,value: boolean){
		 var oldValue = this.entity.views[view];
		 
		 this.entity.views[view] = value;
		 this.refreshDataString();
		 
		 this._ds.saveEntity(this.entity.ico,this.entity)
			 .then((entity) =>  this._toastService.toast("Uloženo.", "notice"))
			 .catch((err) => {
				 this.entity.views[view] = oldValue;
				 this.refreshDataString();
				 this._toastService.toast("Nastala chyba při ukládání","error");
		 });
	 }
	 
	 refreshDataString(){
		 this.dataString = JSON.stringify(this.entity,null,2);
	 }

}