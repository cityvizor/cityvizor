import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'chart-budget',
	templateUrl: 'chart-budget.component.html'
})
export class ChartBudgetComponent {

	@Input() data:{expenditureAmount:number,budgetExpenditureAmount:number,incomeAmount:number,budgetIncomeAmount:number};	

	@Input() max:number;
	
	@Input() type:string;
	
	@Output() click:EventEmitter<string> = new EventEmitter();

	barHeight:number = 150;
	 
	minHeight:number = 10;

	getMaxAmount():number{
		if(this.max) return this.max;	
		
		if(this.data) return Math.max(this.data.expenditureAmount,this.data.budgetExpenditureAmount,this.data.incomeAmount,this.data.budgetIncomeAmount);
		
		return 1000;
	}
	 
	getYOffset(value){
		if(value > 0) return this.barHeight - this.getHeight(value);
		
		if(value < 0) return this.barHeight;
		
		return this.barHeight - this.minHeight;
	}
	 
	getHeight(value){
		if(value > 0) return (value / this.getMaxAmount()) * this.barHeight;
			 
		if(value < 0) return (-1) * (value / this.getMaxAmount()) * this.barHeight;
		
		return this.minHeight;
	}
		 

	constructor(){ }
	
}