import { Component, Input, OnInit } from '@angular/core';

import { DataService } from "../../../services/data.service";
import { ToastService } from "../../../services/toast.service";

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
  
  budgets:any[];

	constructor(private dataService:DataService, private toastService:ToastService) { }
  
  ngOnInit(){
    
    this.dataService.getProfileBudgets(this.profile._id)
      .then(budgets => this.budgets = budgets)
      .catch(err => this.toastService.toast("Nastala chyba při získávání dostupných exportů.","error"));
    
  }

}