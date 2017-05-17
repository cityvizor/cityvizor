import { Component, Input, Output, EventEmitter } from '@angular/core';

import { DataService } 		from '../../../services/data.service';
import { ToastService } 		from '../../../services/toast.service';

import { Entity } from "../../../shared/schema/entity";

//00006947
@Component({
	moduleId: module.id,
	selector: 'site-admin-entity',
	templateUrl: 'site-admin-entity.template.html',
	styleUrls: ['site-admin-entity.style.css']
})
export class SiteAdminEntityComponent {
  
	@Input()
	entity:Entity;
	 
	@Output()
	save:EventEmitter<any> = new EventEmitter;
	 
	@Output()
	delete:EventEmitter<any> = new EventEmitter;
	 
	@Output()
	close:EventEmitter<any> = new EventEmitter;

	constructor(private dataService: DataService, private toastService: ToastService) {
	}
	 
	deleteEntity(){
		var confirmation = window.confirm("Opravdu chcete smazat obec " + this.entity.name + " (" + this.entity._id + ")?");

		if(confirmation) this.delete.emit(this.entity._id);
	}
	 
	saveEntity(form){
		if(form.valid){
			form.value._id = this.entity._id;
			this.save.emit(form.value);
		}
		else{
			this.toastService.toast("Formulář není správně vyplněn.","error");
		}
	}
	 
	 getMapLink(x,y){
		 return "https://mapy.cz/zakladni?x=" + x + "&y=" + y + "&z=10&source=coor&id=" + x + "%2C" + y;
	 }

}