import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title }     from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { DataService } from "../../services/data.service";

import { AppConfig, IAppConfig, Module } from '../../config/config';

import { HeaderConfig } from "../../shared/schema/header";
import { Counterparty, CounterpartyProfile } from "../../shared/schema/counterparty";

//00006947
@Component({
	moduleId: module.id,
	selector: 'counterparty-view',
	templateUrl: 'counterparty-view.template.html',
	styleUrls: ['counterparty-view.style.css']
})
export class CounterpartyViewComponent {

	menuConfig:HeaderConfig = new HeaderConfig();
	
	cat:string;
	
	counterparty:Counterparty;
	
	maxAmount:number;

	showYears:number[] = [];
	budgetYears:number[] = [];
	
	currentYear:number;
	
	paramsSubscription:Subscription;

	constructor(private titleService: Title, private dataService:DataService, private route: ActivatedRoute, @Inject(AppConfig) private config: IAppConfig) {
		this.menuConfig.titleRight.icon = "fa fa-chevron-circle-left";
		
		this.currentYear = (new Date()).getFullYear();
	}

	ngOnInit(){
		
		this.titleService.setTitle(this.config.title);
		
		this.paramsSubscription = this.route.params.subscribe((params: Params) => {
			
			this.cat = params["cat"];
			
			if(!this.counterparty || this.counterparty._id !== params["counterparty"]) {

				this.menuConfig.title.text = "Načítám...";
				
				this.loadCounterparty(params["counterparty"])
					.then(() => this.sortBudgets())
					.then(() => this.createMenu())
					.then(() => this.updateAmounts());
				
			}
		});
		
	}
	
	loadCounterparty(counterpartyId:string):Promise<Counterparty>{
		return this.dataService.getCounterparty(counterpartyId)
			.then(counterparty => this.counterparty = counterparty)	
	}
		
	sortBudgets():void{
		this.counterparty.profiles.sort((a,b) => a.name.localeCompare(b.name));
		this.counterparty.profiles.forEach(profile => {
			profile.budgets.sort((a,b) => a.year - b.year);
		});
	}
	
	createMenu():void{
		this.menuConfig.title.text = this.counterparty.name;
		this.menuConfig.title.link = ["/dodavatel/" + this.counterparty._id];
		this.menuConfig.menu = [
			{ text: "Obce", link: ["/dodavatel/" + this.counterparty._id + "/prehled"] },
			{ text: "Faktury", link: ["/dodavatel/" + this.counterparty._id + "/faktury"] }
		];
	}
		
	updateAmounts():void{
		
		let maxAmount = 0;
		
		let budgetYears = new Set();
		
		this.counterparty.profiles.forEach(profile => {
			
			profile.budgets.forEach(budget => {

				budgetYears.add(budget.year);
				
				maxAmount = Math.max(maxAmount,Number(budget.amount) || 0,0);
			});
		});
		
		this.maxAmount = maxAmount;
		this.budgetYears = Array.from(budgetYears).sort();
		this.showYears = this.budgetYears.slice();
	}
	
	getProfileAverage(profile:CounterpartyProfile):number{

		let sum = 0;
		let count = 0;
		
		profile.budgets
			.filter(budget => this.isVisibleYear(budget.year) && !this.isCurrentYear(budget.year))
			.forEach(budget => {
					sum += Number(budget.amount) || 0;
					count++;
			});
		
		return (sum / count) || 0;
	}
	
	isVisibleYear(year:number):boolean{
		return this.showYears.indexOf(year) !== -1;
	}
	
	isCurrentYear(year:number):boolean{
		return year >= this.currentYear;
	}
	
	toggleYear(year:number):void{
		if(this.isVisibleYear(year)) this.showYears = this.showYears.filter(item => item !== year);
		else this.showYears.push(year);
	}

}