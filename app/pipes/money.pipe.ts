import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'money'})
export class MoneyPipe implements PipeTransform {
	transform(value: number, decimal: number, autoDivide: boolean): string {
		
		var add = "";
		
		if(autoDivide){
			
			if(value > 950){value = value / 1000;add = " tis.";}
			if(value > 950){value = value / 1000;add = " mil.";}
			if(value > 950){value = value / 1000;add = " mld.";}
		}
		
		if(decimal !== false) value = Math.round(value * Math.pow(10,decimal)) / Math.pow(10,decimal);
		
		var parts = value.toString().split(".");
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
		
		if(decimal !== false && parts[1] && parts[1].length < decimal) parts[1] = String(parts[1] + "0".repeat(decimal)).slice(0,decimal);
		
		return parts.join(",") + add;
	}
}