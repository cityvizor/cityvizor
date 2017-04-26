import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { DataService } 		from '../../../services/data.service';
import { ToastService } 		from '../../../services/toast.service';

import { Entity } from "../../../shared/schema/entity";

//00006947
@Component({
	moduleId: module.id,
	selector: 'site-admin-entities',
	templateUrl: 'site-admin-entities.template.html',
	styleUrls: ['site-admin-entities.style.css']
})
export class SiteAdminEntitiesComponent {

	entities:{docs: Entity[], limit: number, page: number, pages: number, total: number} = {
		docs:[],
		limit:20,
		page:1,
		pages:0,
		total:0
	};

	currentEntity:Entity;

	entityLoading:boolean = false;

	search = {
		name: "",
		"address.postalCode": "",
		ico: ""
	};	

	constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private toastService: ToastService) {
		
	}
	
	ngOnInit(){
    this.loadEntities(1);
		
		this.route.params.forEach((params: Params) => {		
			
			if(params["entity"]) this.loadEntity(params["entity"]);
			else this.currentEntity = null;
			
		});
		
  }

	openPage(page){
		page = Math.max(Math.min(page,this.entities.pages),1);
		this.loadEntities(page);
	}

	getNameRange(){
		if(!this.entities || !this.entities.docs.length) return "";
		return this.entities.docs[0].name + " ~ " + this.entities.docs[this.entities.docs.length - 1].name;
	}	

	loadEntities(page){
							
			var options = {
				limit:this.entities.limit,
				page: page,
				fields:"_id name ico address.postalCode",
				sort:"name",
				search:this.search
			};
		
			// load entities and save to local variable
			this.dataService.getEntities(options)
				.then(entities => {
					this.entities = entities;
					this.entities.docs.sort((a,b) => a.name > b.name ? 1 : (a.name < b.name ? -1 : 0));
				})
				.catch(err => {
					this.toastService.toast("Nastala neznámá chyba při načítání obcí.","error");
				});
	}

	loadEntity(entityId){
		
		if(!entityId) return;
		
		this.entityLoading = true;
		this.currentEntity = null;
		
		this.dataService.getEntity(entityId)
      .then(Entity => {
        this.currentEntity = Entity;
				this.entityLoading = false;
      })
			.catch(err => {
				this.entityLoading = false;
				this.toastService.toast("Nastala neznámá chyba při načítání profilu.","error");
			});
	}

	saveEntity(Entity){
		this.dataService.saveEntity(Entity)
			.then(entity => {
				this.toastService.toast("Uloženo.","notice");
				this.loadEntities(this.entities.page);
			})
			.catch(err => this.toastService.toast("Nastala neznámá chyba při ukládání profilu.","error"));
	}

	deleteEntity(entityId){
		
	}

	getDetailLink(entityId){
		return entityId ? ["./",{entity:entityId}] : ["./",{}];
	}

	selectEntity(entityId){
		this.router.navigate(this.getDetailLink(entityId),{relativeTo:this.route});
	}

	getEntityLink(entity){
		return "/profil/" + (entity.url || entity._id);
	}

}