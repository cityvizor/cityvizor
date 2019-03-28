import { Pipe, PipeTransform } from '@angular/core';


@Pipe({name: 'abs'})
export class AbsPipe implements PipeTransform {
	transform(value: number): number {
		return Math.abs(value);
	}
}

@Pipe({name: 'ico'})
export class IcoPipe implements PipeTransform {
	transform(value: string): string {
		return ('00000000' + value).slice(-8);
	}
}
/*
 * Join array of strings by separator
 */
@Pipe({name: 'concat'})
export class ConcatPipe implements PipeTransform {
	transform(value: string[], separator: string): string {
		return value.join(separator);
	}
}

@Pipe({name: 'arraychildren'})
export class ArrayChildrenPipe implements PipeTransform {
	transform(value: Object[], propName: string): string[] {
		return value.map(item => item[propName]);
	}
}

@Pipe({name: 'array'})
export class ArrayPipe implements PipeTransform {
	transform(value:any, objKeyName?:string): any[] {

		// leave array as array
		if(typeof value === "object" && value.constructor === Array) return value;

		else if(typeof value === "object"){
			return Object.keys(value).map(key => {
				if(objKeyName) value[key][objKeyName] = key;
				
				return value[key];
			});
		}

		else return [value];
		
	}
}