import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { DataService } from 'app/services/data.service';
import { CodelistService } from 'app/services/codelist.service';
import { ToastService } from 'app/services/toast.service';

/*

Component for graphical vizualization of event

*/
@Component({
	moduleId: module.id,
	selector: 'event-detail',
	templateUrl: 'event-detail.component.html',
	styleUrls: ['event-detail.component.scss'],
	animations: [
		trigger('paymentsState', [
			state('closed', style({ display: 'none', opacity: 0 })),
			state('open', style({ display: 'block', opacity: 1 })),
			transition('closed => open', [style({ height: 0 }), animate('250ms ease-in', style({ opacity: 1, height: '*' }))]),
			transition('open => closed', animate('250ms ease-out', style({ opacity: 0, height: 0 })))
		])
	]
})
export class EventDetailComponent implements OnChanges {

	/* DATA */
	@Input() profileId: string;
	@Input() eventId: number;
	@Input() year: number;

	@Output()
	selectEvent: EventEmitter<string> = new EventEmitter();

	event: any;

	itemNames: any;
	paragraphNames: any;

	maxExpenditureAmount: number;
	maxIncomeAmount: number;

	history: any[];
	maxHistoryAmount: number = 0;

	counterparties: any[] = [];
	otherPayments: any = { payments: [], total: 0, open: false };

	constructor(private dataService: DataService, private codelistService: CodelistService, private toastService: ToastService) { }

	ngOnChanges(changes: SimpleChanges) {
		if (this.profileId && this.eventId && this.year) this.loadEvent(this.profileId, this.eventId, this.year);
	}

	async loadEvent(profileId: string, eventId: number, year: number) {
		this.event = null;

		const event = await this.dataService.getProfileEvent(profileId, eventId, year);

		this.maxExpenditureAmount = Math.max(event.expenditureAmount, event.budgetExpenditureAmount);
		this.maxIncomeAmount = Math.max(event.incomeAmount, event.budgetIncomeAmount);

		this.event = event;

		// get event accross years;
		this.history = await this.dataService.getProfileEventHistory(this.profileId, this.eventId);

		this.maxHistoryAmount = this.history.reduce((acc, cur) => Math.max(acc, cur.expenditureAmount, cur.incomeAmount, cur.budgetExpenditureAmount, cur.budgetIncomeAmount), -Infinity);

	}

	openYear(year:number){
		this.year = year;
		this.loadEvent(this.profileId, this.eventId, this.year);
	}

	openPayments(counterparty) {
		counterparty.open = !counterparty.open;
	}

}