import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

class ChartHistoryBar {

  amount:number = 0;
	budgetAmount:number = 0;
  
  constructor(public year:number){}
}


@Component({
	selector: 'chart-history',
	templateUrl: 'chart-history.template.html',
	styleUrls: ['chart-history.style.css']
})
export class ChartHistoryComponent implements OnChanges {
  
  @Input()
  id:string;
  
  @Input()
  name:string;
  
  @Input()
  data:ChartHistoryBar[] = [];
  
  bars:ChartHistoryBar[] = [];
  barsIndex:any = {};
  
  currentYear:number;
  hoverYear:number;
	
	maxAmount:number;
  
  constructor(){
    this.currentYear = (new Date()).getFullYear();
    
    for(let y = this.currentYear - 9; y <= this.currentYear; y++){
      let bar = new ChartHistoryBar(y);
      this.bars.push(bar);
      this.barsIndex[y] = bar;
    }
  }
  
  ngOnChanges(changes:SimpleChanges){
    if(changes.data) {
      changes.data.currentValue.forEach(data => {
        if(this.barsIndex[data.year]){
					this.barsIndex[data.year].amount = data.amount || 0;
					this.barsIndex[data.year].budgetAmount = data.budgetAmount || 0;
				}
      });
			
			this.maxAmount = this.bars.reduce((max,bar) => max = Math.max(max, bar.amount, bar.budgetAmount),0);
    }
  }
  
  getLastAmount():number{
    return this.barsIndex[this.currentYear].amount;
  }
  
  getLink(year:number){
   return ["../vydaje",{rok:year,skupina:this.id}];
  }
}