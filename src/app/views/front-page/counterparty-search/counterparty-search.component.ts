import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { NgForm } from "@angular/forms";

import { DataService } from '../../../services/data.service';
import { ToastService } from '../../../services/toast.service';

import * as WordCloud from "wordcloud";
import { Router } from '@angular/router';

@Component({
	moduleId: module.id,
	selector: 'counterparty-search',
	templateUrl: 'counterparty-search.component.html',
	styleUrls: ['counterparty-search.component.scss']
})
export class CounterpartySearchComponent implements OnInit {

	results: any[];

	supplierQuery: string = '';
	supplierQueryFocus: boolean = false;
	supplierSelected: number = 0;

	wordcloudMinSize = 10;
	wordcloudMaxSize = 70;
	wordcloudMinOpacity = 0.2;
	wordcloudMaxOpacity = 1;

	@ViewChild("wordcloud") wordcloudEl: ElementRef<HTMLElement>;

	constructor(private dataService: DataService, private toastService: ToastService, private router:Router) { }

	ngOnInit(){
		this.createWordcloud();
	}

	search(form: NgForm) {

		var formData = form.value;

		this.dataService.searchCounterparties(formData.query)
			.then(results => this.results = results)
			.catch(err => this.toastService.toast("Nastal chyba při vyhledávání dodavatelů.", "error"));
	}

	async createWordcloud() {
		const counterparties = await this.dataService.getCounterpartiesTop();
		

		const max = counterparties.reduce((acc,cur) => Math.max(cur.amount,acc),0);

		const replaced = ["spol\\. s r\\.o\\.","a\\. ?s\\.","s\\.? ?r\\. ?o\\.","JUDR\\.","příspěvková organizace",","].map(string => new RegExp(string,"i"));

		counterparties.forEach(counterparty => {
			replaced.forEach(replace => counterparty.name = counterparty.name.replace(replace,""))
			counterparty.name = counterparty.name.trim();
		})

		const list = counterparties.map(counterparty => [counterparty.name, Math.round((1 - counterparty.amount / max) * this.wordcloudMinSize + counterparty.amount / max * this.wordcloudMaxSize)]);

		const options = {
			list,		
			rotateRatio:0,	
			color: (word, weight, fontSize, distance, theta) => `rgba(37, 129, 196, ${(1 - (fontSize - this.wordcloudMinSize) / (this.wordcloudMaxSize - this.wordcloudMinSize)) * this.wordcloudMinOpacity + ((fontSize - this.wordcloudMinSize) / (this.wordcloudMaxSize - this.wordcloudMinSize)) * this.wordcloudMaxOpacity})`,
			classes: "word",
			click: (item, dimension, event) => {
				const counterparty = counterparties.find(counterparty => counterparty.name === item[0]);
				if(!counterparty) return;
				this.openCounterparty(counterparty._id);
			}
		};

		WordCloud(this.wordcloudEl.nativeElement, options );
	}

	openCounterparty(counterpartyId:string){
		this.router.navigate(["/dodavatele",counterpartyId]);
	}

	querySupplier(query:string) {

		if (query!='') this.supplierQueryFocus=true;

		this.dataService.searchCounterparties(query)
			.then(results => this.results = results)
			.catch(err => this.toastService.toast("Nastal chyba při vyhledávání dodavatelů.", "error"));
	}

	selectSupplier(direction:string) {
		if (direction == 'up' && this.supplierSelected>0) this.supplierSelected--;
		if (direction == 'down' && this.supplierSelected<(this.results.length-1)) this.supplierSelected++;
		if (direction == 'route') {
			this.router.navigate(['/dodavatele/' + this.results[this.supplierSelected].counterpartyId]);
		}
	}
}
