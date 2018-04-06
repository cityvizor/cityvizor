import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";

import { DataService } from '../../../services/data.service';
import { ToastService } from '../../../services/toast.service';

@Component({
	moduleId: module.id,
  selector: 'counterparty-search',
	templateUrl: 'counterparty-search.template.html',
	styleUrls: ['counterparty-search.style.css']
})
export class CounterpartySearchComponent {
  
  results:any[];
 
  constructor( private dataService:DataService, private toastService:ToastService ){}
  
  search(form:NgForm){
    
    var formData = form.value;
    
		var query:any = {
			limit: 10,
			query: formData.query
		};

		this.dataService.searchCounterparties(query)
			.then(results => this.results = results)
			.catch(err => this.toastService.toast("Nastal chyba při vyhledávání dodavatelů.","error"));
	}
}
	