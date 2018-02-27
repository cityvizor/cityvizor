import { Component, Input, OnInit, Inject} from '@angular/core';

import { DataService } from "../../../services/data.service";
import { ToastService } from "../../../services/toast.service";

import { AppConfig, IAppConfig } from '../../../config/config';

import { ETL } from "../../../shared/schema/etl";

@Component({
	moduleId: module.id,
	selector: 'data-sources',
	templateUrl: 'data-sources.template.html',
	styleUrls: ['data-sources.style.css'],
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
	
	getBudgetsLink(etl:ETL){
		return '/exports/profiles/' + etl.profile + '/budgets/' + etl.year;
	}
	getPaymentsLink(etl:ETL){
		return '/exports/profiles/' + etl.profile + '/payments/' + etl.year;
	}

}