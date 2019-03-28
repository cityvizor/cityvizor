import { Injectable } from '@angular/core';


/**
  * Service to manage warning toasts
	* 
	* toast() - create new toast
	*/
@Injectable({
	providedIn: "root"
})
export class ToastService {

	/**
		* array of toasts
		*/
	toasts: Array<{ text: string, status: string }> = [];

	/**
		* text:string - text of toast
		* status:string - status type of toast, translates possibly to class
		*/
	toast(text: string, status: string): void {

		this.toasts.push({ text: text, status: status ? status : "notice" });

		setTimeout(() => this.toasts.shift(), 2000);
	}



}