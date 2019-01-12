import { Component, Input, OnInit, Inject} from '@angular/core';

import { DataService } from "app/services/data.service";
import { ToastService } from "app/services/toast.service";

import { AppConfig, IAppConfig } from 'config/config';

import { ETL } from "app/shared/schema/etl";

@Component({
	moduleId: module.id,
	selector: 'data-sources',
	templateUrl: 'data-sources.component.html',
	styleUrls: ['data-sources.component.css'],
})
export class DataSourcesComponent implements OnInit {

	/* DATA */
	@Input()
	profile:any;
	
  etls:ETL[];

	constructor(private dataService:DataService, private toastService:ToastService, @Inject(AppConfig) public config:IAppConfig) { }
  
  ngOnInit(){
    
    this.dataService.getProfileETLs(this.profile._id)
      .then(etls => this.etls = etls.filter(etl => etl.visible))
      .catch(err => this.toastService.toast("Nastala chyba při získávání dostupných exportů.","error"));
    
  }

}