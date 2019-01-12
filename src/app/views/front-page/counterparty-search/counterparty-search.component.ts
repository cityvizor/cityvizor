import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";

import { DataService } from '../../../services/data.service';
import { ToastService } from '../../../services/toast.service';

@Component({
	moduleId: module.id,
  selector: 'counterparty-search',
	templateUrl: 'counterparty-search.component.html',
	styleUrls: ['counterparty-search.component.css']
})
export class CounterpartySearchComponent {
  
  results:any[];
 
  constructor( private dataService:DataService, private toastService:ToastService ){}
  
  search(form:NgForm){
    
    var formData = form.value;

		this.dataService.searchCounterparties(formData.query)
			.then(results => this.results = results)
			.catch(err => this.toastService.toast("Nastal chyba při vyhledávání dodavatelů.","error"));
	}
}
	