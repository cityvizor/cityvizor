import { Component, Input } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'chart-budget',
	templateUrl: 'chart-budget.template.html'
})
export class ChartBudgetComponent {

	@Input() data:{expenditureAmount:number,budgetExpenditureAmount:number,incomeAmount:number,budgetIncomeAmount:number};	

	@Input() max:number;

	barHeight:number = 490;
	 
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
		if(value > 0) return (value / this.getMaxAmount()) * this.barHeight + this.minHeight;
			 
		if(value < 0) return (-1) * (value / this.getMaxAmount()) * this.barHeight + this.minHeight;
		
		return this.minHeight;
	}
		 

	constructor(){ }
	
}