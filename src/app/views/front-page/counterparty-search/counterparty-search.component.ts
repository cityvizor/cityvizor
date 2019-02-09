import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from "rxjs/operators";

import { DataService } from '../../../services/data.service';
import { ToastService } from '../../../services/toast.service';

import { Counterparty } from 'app/shared/schema/counterparty';

import { Word } from 'app/shared/components/word-cloud/word-cloud.component';

@Component({
	moduleId: module.id,
	selector: 'counterparty-search',
	templateUrl: 'counterparty-search.component.html',
	styleUrls: ['counterparty-search.component.scss']
})
export class CounterpartySearchComponent implements OnInit {

	results: any[];

	supplierQuery: BehaviorSubject<string> = new BehaviorSubject("");
	supplierQueryFocus: boolean = false;
	supplierSelected: number = 0;

	wordcloudCounterparties:Counterparty[]; // save so we can lookup on click
	wordcloud:Word[] = [];

	constructor(private dataService: DataService, private toastService: ToastService, private router:Router) { }

	ngOnInit(){
		this.loadTopCounterparties();

		this.supplierQuery.pipe(debounceTime(500)).subscribe(query => this.querySupplier(query));
	}

	async loadTopCounterparties(){
		const counterparties = await this.dataService.getCounterpartiesTop();

		const removeStrings = ["spol\\. s r\\.o\\.", "a\\. ?s\\.", "s\\.? ?r\\. ?o\\.", "s\\. ?p\\.", "JUDR\\.", "příspěvková organizace", ","].map(string => new RegExp(string, "i"));

		counterparties.forEach(counterparty => {
      removeStrings.forEach(removeString => counterparty.name = counterparty.name.replace(removeString, ""))
      counterparty.name = counterparty.name.trim();
		})

		// save so we can lookup on word click
		this.wordcloudCounterparties = counterparties;

		this.wordcloud = this.wordcloudCounterparties.map(counterparty => [counterparty.name,counterparty.amount] as [string,number]);

	}

	openWord(word:Word){
		const counterparty = this.wordcloudCounterparties.find(counterparty => counterparty.name === word[0]);
		if(counterparty) this.openCounterparty(counterparty._id)
	}

	openCounterparty(counterpartyId:string){
		this.router.navigate(["/dodavatele",counterpartyId]);
	}

	querySupplier(query:string) {
		this.supplierSelected = 0;

		if (query!='') this.supplierQueryFocus=true;

		this.dataService.searchCounterparties(query)
			.then(results => this.results = results)
			.catch(err => this.toastService.toast("Nastal chyba při vyhledávání dodavatelů.", "error"));
	}

	selectSupplier(direction:string) {
		if (direction == 'up' && this.supplierSelected>0) this.supplierSelected--;
		if (direction == 'down' && this.supplierSelected<(this.results.length-1)) this.supplierSelected++;
		if (direction == 'route' && this.supplierQueryFocus) {
			this.router.navigate(['/dodavatele/' + this.results[this.supplierSelected].counterpartyId]);
		}
	}
}
