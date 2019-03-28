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

  config:any = {
    visibleYears: 4,
    maxVisibleYears: 6,
    width: 200,
    height: 75
  };
  
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
  }
  
  ngOnChanges(changes:SimpleChanges){

    if(changes.data) {
      this.config.visibleYears = Math.min(this.config.maxVisibleYears,changes.data.currentValue.length);

      this.config.spacing = this.config.width / this.config.visibleYears;

      this.currentYear = changes.data.currentValue.reduce((max,data) => max = Math.max(max, data.year),0);;
      this.hoverYear = this.currentYear;
      
      for(let y = this.currentYear - (this.config.visibleYears-1); y <= this.currentYear; y++){
        let bar = new ChartHistoryBar(y);
        this.bars.push(bar);
        this.barsIndex[y] = bar;
        this.chartPoints['amount'][y] = [];
        this.chartPoints['budgetAmount'][y] = [];
      }

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
      var height = this.config.height-20;
      
      x = index*this.config.spacing+this.config.spacing/2;
      y = (height)-Math.round((data[type]-this.stats.min)/(this.stats.max-this.stats.min)*(height-10));

      if (data[type]>0) {
        if (numPoints == 0) {
          pathString += 'M' + x + ','+y;
          numPoints++;
        } else {
          pathString += ' C' + (prevX+this.config.spacing/2) + ',' + prevY + ' ' + (x-this.config.spacing/2) + ',' + y + ' ' + x + ',' + y;
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