import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { DataService } 		from '../../../services/data.service';
import { ToastService } 		from '../../../services/toast.service';

import { Profile } from "../../../shared/schema/profile";
import { Entity } from "../../../shared/schema/entity";

//00006947
@Component({
	moduleId: module.id,
	selector: 'site-admin-profile',
	templateUrl: 'site-admin-profile.template.html',
	styleUrls: ['site-admin-profile.style.css']
})
export class SiteAdminProfileComponent implements OnChanges {
  
	@Input()
	profile:Profile;
	 
	@Output()
	save:EventEmitter<any> = new EventEmitter;
	 
	@Output()
	delete:EventEmitter<any> = new EventEmitter;
	 
	@Output()
	close:EventEmitter<any> = new EventEmitter;
	 
	entity:Entity;
	 
	entityChecked:boolean = false;
	loadingEntity:boolean = false;

	constructor(private dataService: DataService, private toastService: ToastService) {
	}
	 
	ngOnChanges(changes: SimpleChanges){
		if(this.profile && changes.profile) this.checkEntity(this.profile.entity._id);
	}
	 
	deleteProfile(){
		var confirmation = window.confirm("Opravdu chcete smazat profil " + this.profile.name + " (" + this.profile._id + ")?");

		if(confirmation) this.delete.emit(this.profile._id);
	}
	 
	saveProfile(form){
		if(form.valid){
			form.value._id = this.profile._id;
			this.save.emit(form.value)
		}
		else{
			this.toastService.toast("Formulář není správně vyplněn.","error");
		}
	}
	 
	checkEntity(entityId){
		
		if(this.entity && this.entity._id === entityId) return;
			 
		this.loadingEntity = true;
		this.dataService.getEntity(entityId)
			.then(entity => {
				this.entity = entity;
				this.loadingEntity = false;
				this.entityChecked = true;
			})
			.catch(err => {
				this.entity = null;
				this.loadingEntity = false;
				this.entityChecked = true;
			});
	}

}