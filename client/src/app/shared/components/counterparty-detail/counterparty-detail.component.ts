import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DataService } from 'app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { DateTime } from 'luxon';

@Component({
	moduleId: module.id,
	selector: 'counterparty-detail',
	templateUrl: 'counterparty-detail.component.html',
	styleUrls: ['counterparty-detail.component.scss'],
	animations: [
		trigger('paymentsState', [
			state('closed', style({ display: 'none', opacity: 0 })),
			state('open', style({ display: 'block', opacity: 1 })),
			transition('closed => open', [style({ height: 0 }), animate('250ms ease-in', style({ opacity: 1, height: '*' }))]),
			transition('open => closed', animate('250ms ease-out', style({ opacity: 0, height: 0 })))
		])
	]
})
export class CounterpartyDetailComponent implements OnInit {

	/* DATA */
	@Input() profileId: string;
	@Input() counterpartyId: string;
	@Input() year: number;
	@Input() month?: number;
    
    counterpartyName: string;
    payments: any[]

	constructor(private dataService: DataService, private route: ActivatedRoute) { }

    async ngOnInit() {
		if (!this.year) return;
		const date = DateTime.fromObject({year: this.year, month: this.month ? this.month : 1, day: 1});
		let params = {
			profileId: this.profileId,
			dateFrom: date.toISODate(),
			dateTo: this.month ? date.plus({month: 1}).toISODate() : date.plus({year: 1}).toISODate(),
		};
        this.counterpartyName = (await this.dataService.getCounterparty(this.counterpartyId))[0].name
		this.payments = await this.dataService.getCounterpartyPayments(this.counterpartyId, params);
		this.payments.sort((first, second) => Date.parse(first.date) < Date.parse(second.date) ? -1 : 1)
    }
}