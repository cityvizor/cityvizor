import {Injectable} from '@angular/core';

class ToastItem{
	
	public opacity: number = 1;

	constructor(public text: string, public status: string, public stick: boolean){
		if(!this.stick) setTimeout(() => this.hide(), 2000);
	}

	dim(){
		this.opacity = 0.3;
	}

	hide(){
		this.opacity = 0;
	}

	show(){
		this.opacity = 1;
	}

}

@Injectable()
export class ToastService {
	
	toasts: Array<ToastItem> = [];

	toast(text: string, status: string, stick?: boolean){
		var toast = new ToastItem(text, status ? status : "notice", stick);
		this.toasts.push(toast);
		return toast;
	}



}