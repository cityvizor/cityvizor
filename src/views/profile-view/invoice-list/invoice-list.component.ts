import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs' ;

import { ToastService } 		from '../../../services/toast.service';
import { DataService } 		from '../../../services/data.service';

@Component({
	moduleId: module.id,
	selector: 'invoice-list',
	templateUrl: 'invoice-list.template.html',
	styleUrls: ['invoice-list.style.css'],
})
export class InvoiceListComponent implements OnInit, OnDestroy {

	/* DATA */
	@Input()
	set profile(profile: any){
		if(profile && this.profileId !== profile._id) {
			this.profileId = profile._id;
			this.loadMonths();
		}
	}
	
	profileId:string;
	
	invoices:any[] = [];
  
	months:any;
  monthNames:string[] = ["Leden","Únor","Březen","Duben","Květen","Červen","Červenec","Srpen","Září","Říjen","Listopad","Prosinec"];	
	currentMonth:number;
	
	years:number[];
	currentYear:number;
	
	pager:{pages:number[],page:number,total:number} = {pages:[1],page:1,total:0};
	
	loading:boolean = false;
	
	paramsSubscription:Subscription;
  
	constructor(private dataService:DataService, private toastService:ToastService, private router: Router, private route: ActivatedRoute) { }
	
	ngOnInit(){
		
		this.paramsSubscription = this.route.params.subscribe((params: Params) => {		
			
			let year = Number(params["rok"]);
			let month = Number(params["mesic"]);
			let page = Number(params["strana"]);
			
			this.currentYear = year;
			this.currentMonth = month;
			
			if(year && month) this.loadData(year, month, page || 1);
			
		});
	}
	
	ngOnDestroy(){
		this.paramsSubscription.unsubscribe();
	}
	
	loadMonths(){
		this.dataService.getProfilePaymentsMonths(this.profileId)
			.then(months => {
			
				this.months = {};
			
				months.forEach(month => {
					if(!this.months[month.year]) this.months[month.year] = [];
					this.months[month.year].push(month.month);
				});
				this.years = [];
				Object.keys(this.months).forEach(year => this.years.push(Number(year)));
			
				this.years.sort();
			
				if(!this.currentYear) this.selectMonth(this.years[this.years.length - 1],Math.max(...this.months[this.years[this.years.length - 1]]));
				else if(!this.currentMonth) this.selectMonth(this.currentYear,1);
			
			})
			.catch(err => this.toastService.toast("Nastala chyba při stahování dat", "error"));
	}

	loadData(year, month,page){
		
		let params = {
			dateFrom: year + "-" + ("00" + month).slice(-2) + "-01",
			dateTo: month === 12 ? (year + 1) + "-" + ("00" + month).slice(-2) + "-01" :  year + "-" + ("00" + (month + 1)).slice(-2) + "-01",
			sort: "date",
			limit: 20,
			page: page
		};
    
		this.loading = true;
		this.dataService.getProfilePayments(this.profileId,params)
			.then(data => {
			
				this.invoices = data.docs;
			
				this.pager = {
					pages: [],
					total: data.total,
					page: data.page
				};
				for(let i = 1; i <= data.pages; i++) this.pager.pages.push(i);
			
				this.loading = false;
			})
			.catch(err => this.toastService.toast("Nastala chyba při získávání faktur","error"));
	 }
	
	selectYear(year:number):void{
		this.router.navigate(this.getYearLink(year),{relativeTo:this.route, replaceUrl: !this.currentYear});
	}
	selectMonth(year:number,month:number):void{
		this.router.navigate(this.getMonthLink(year,month),{relativeTo:this.route, replaceUrl: !this.currentYear || !this.currentMonth});
	}
	
	getYearLink(year:number):any{
		return this.getMonthLink(year,Math.min(...this.months[year]));
	}
	getMonthLink(year:number,month:number):any{
		return ["./",{"rok": year, "mesic": month, "strana": 1}];
	}
	getPageLink(page:number):any{
		return ["./",{"rok": this.currentYear, "mesic": this.currentMonth, "strana": page}];
	}
}