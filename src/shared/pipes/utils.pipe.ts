import { Pipe, PipeTransform } from '@angular/core';

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