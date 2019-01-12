import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MinLengthValidator } from '@angular/forms';

class ChartHistoryBar {

  amount:number = 0;
	budgetAmount:number = 0;
  
  constructor(public year:number){}
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
	
  maxAmount:number;
  minAmount:number;
  
	chartPathString:string;
  
  constructor(){
    this.currentYear = (new Date()).getFullYear();
    
    for(let y = this.currentYear - 3; y <= this.currentYear; y++){
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
			
      this.maxAmount = this.bars.reduce((max,bar) => max = Math.max(max, /*bar.amount,*/ bar.budgetAmount),0);
      this.minAmount = this.bars.reduce((min,bar) => min = Math.min(min, /*bar.amount,*/ bar.budgetAmount),Infinity);
      
      //create path for svg chart

      this.chartPathString = '';
      var x,y,prevX,prevY,numPoints = 0;
      this.bars.forEach((data, index, array) => {
        //TO DO: get height, and horizontal spacing as parameter
        var height = 80;
        var minHeight = 20; //minimal is still 0
        var spacing = 50;
        
        x = index*spacing+25;
        y = (height-5)-minHeight-Math.round((data.budgetAmount-this.minAmount)/(this.maxAmount-this.minAmount)*(height-10-minHeight));

        if (data.budgetAmount>0 || true) {
          if (numPoints == 0) {
            this.chartPathString += 'M' + x + ','+y;
            numPoints++;
          } else {
            this.chartPathString += ' C' + (prevX+spacing/2) + ',' + prevY + ' ' + (x-spacing/2) + ',' + y + ' ' + x + ',' + y;
            numPoints++;
          }

          prevX = x;
          prevY = y;
        }
      });
    }
  }
  
  getLastAmount():number{
    return this.barsIndex[this.currentYear].amount;
  }
  
  getLink(year:number){
   return ["../vydaje",{rok:year,skupina:this.id}];
  }
}