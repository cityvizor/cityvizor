import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MinLengthValidator } from '@angular/forms';

class ChartHistoryBar {

  amount:number = 0;
  budgetAmount:number = 0;
  
  constructor(public year:number){ }
}


@Component({
	selector: 'chart-history',
	templateUrl: 'chart-history.component.html',
	styleUrls: ['chart-history.component.scss']
})
export class ChartHistoryComponent implements OnChanges {
  
  @Input()
  id:string;
  
  @Input()
  name:string;

  @Input()
  icon:string;
  
  @Input()
  data:ChartHistoryBar[] = [];
  
  bars:ChartHistoryBar[] = [];
  barsIndex:any = {};
  
  currentYear:number;
  hoverYear:number;
  
  stats:any = {
    max: 0,
    min: Infinity
  };
  
	chartPathString:string;
	chartBudgetPathString:string;
	chartPoints:any = {
    amount: [],
    budgetAmount: []
  };
  
  constructor(){
    this.currentYear = (new Date()).getFullYear()-1;
    this.hoverYear = this.currentYear;
    
    for(let y = this.currentYear - 3; y <= this.currentYear; y++){
      let bar = new ChartHistoryBar(y);
      this.bars.push(bar);
      this.barsIndex[y] = bar;
      this.chartPoints['amount'][y] = [];
      this.chartPoints['budgetAmount'][y] = [];
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
			
      this.stats.max = this.bars.reduce((max,bar) => max = Math.max(max, bar.amount, bar.budgetAmount),0);
      this.stats.min = this.bars.reduce((min,bar) => min = Math.min(min, bar.amount, bar.budgetAmount),0);
      
      //create path for svg chart
      this.chartPathString = this.getChartPathString('amount');
      this.chartBudgetPathString = this.getChartPathString('budgetAmount');
    }
  }
  
  getLink(year:number){
   return ["../vydaje",{rok:year,skupina:this.id}];
  }

  getChartPathString(type:string):string{
    var pathString = '';
    var x,y,prevX,prevY,numPoints = 0;
    this.bars.forEach((data, index) => {
      //TO DO: get height, and horizontal spacing as parameter
      var height = 65;
      var minHeight = 0; //minimal is still 0
      var spacing = 50;
      
      x = index*spacing+25;
      y = (height)-minHeight-Math.round((data[type]-this.stats.min)/(this.stats.max-this.stats.min)*(height-10-minHeight));

      if (data[type]>0) {
        if (numPoints == 0) {
          pathString += 'M' + x + ','+y;
          numPoints++;
        } else {
          pathString += ' C' + (prevX+spacing/2) + ',' + prevY + ' ' + (x-spacing/2) + ',' + y + ' ' + x + ',' + y;
          numPoints++;
        }
        this.chartPoints[type][data.year] = [x, y];
        prevX = x;
        prevY = y;
      }
    });
    return pathString;
  }
}