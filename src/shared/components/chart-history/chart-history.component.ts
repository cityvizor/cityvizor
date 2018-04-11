import { Component, Input, OnChanges, SimpleChanges, trigger, state, style, transition, animate } from '@angular/core';

class ChartHistoryBar {

  amount:number = 0;
  
  constructor(public year:number){}
}


@Component({
	selector: 'chart-history',
	templateUrl: 'chart-history.template.html',
	styleUrls: ['chart-history.style.css'],
  animations: [
		trigger('showAnimation', [
			transition(':enter', [
				style({opacity: 0}),
				animate("500ms", style({opacity: 1}))
			])
		])
	]
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
        if(this.barsIndex[data.year]) this.barsIndex[data.year].amount = data.amount;
      })
    }
  }
  
  getLastAmount():number{
    return this.barsIndex[this.currentYear].amount;
  }
  
  getMaxAmount():number{
    return this.bars.reduce((max,bar) => max = Math.max(max,bar.amount),0);
  }
  
  getLink(year:number){
   return ["../vydaje",{rok:year,skupina:this.id}];
  }
}