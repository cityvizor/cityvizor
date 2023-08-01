import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { DataService } from 'app/services/data.service';
import { CodelistService } from 'app/services/codelist.service';
import { ToastService } from 'app/services/toast.service';

import { BudgetEvent, BudgetPayment, Counterparty, BudgetItem, Profile, Budget } from 'app/schema';

type CounterpartyOpenable = (Counterparty & { open: boolean });

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
	@Input() profile: Profile;
	@Input() eventId: number;
	@Input() year: number;
	@Input() sa: number; // Only for PBOs

	@Output()
	selectEvent: EventEmitter<string> = new EventEmitter();

	budgetView: string = "expenditureParagraphs";

	event: BudgetEvent;

	payments: BudgetPayment[] = [];

	counterparties: CounterpartyOpenable[];

	maxExpenditureAmount: number;
	maxIncomeAmount: number;

	history: any[];
	maxHistoryAmount: number = 0;

	isCurrentYear: boolean;

	expenditureItems: BudgetItem[] = [];
	incomeItems: BudgetItem[] = [];
	expenditureParagraphs: BudgetItem[] = [];

	itemNames: { [id: string]: string } = {};
	paragraphNames: { [id: string]: string } = {};

	constructor(private dataService: DataService, private codelistService: CodelistService, private toastService: ToastService) { }

	ngOnChanges(changes: SimpleChanges) {

		if (changes.year) {
			this.loadCodelists(this.year);
			this.isCurrentYear = this.year === (new Date()).getFullYear();
		}

		if ((changes.profileId || changes.eventId || changes.year) && this.profile?.id && this.eventId && this.year) {
			this.loadEvent(this.profile.id, this.eventId, this.year);
		}
	}

	async loadCodelists(year: number) {
		if (this.isMunicipality) {
			const date = new Date(year, 0, 1);
			this.itemNames = await this.codelistService.getCurrentIndex("items", date);
			this.paragraphNames = await this.codelistService.getCurrentIndex("paragraphs", date);
		} else {
			const suNames = await this.dataService.getCodelist("pbo-su")
			const convertedNames = suNames.reduce((acc, c)=> {
				acc[c.id] = c.name
				return acc
			}, {})
			this.itemNames = convertedNames
			this.paragraphNames = convertedNames
		}
	}

	async loadEvent(profileId: number, eventId: number, year: number) {
		let event: BudgetEvent;
		if (this.isMunicipality) {
			event = await this.dataService.getProfileEvent(profileId, eventId, year);
		} else {
			const aa = Number(this.eventId.toString().substring(0, 3))
			const sa = Number(this.eventId.toString().substring(3))
			event =  await this.dataService.getProfileAa(profileId, year, aa, sa)
		}

		this.maxExpenditureAmount = Math.max(event.expenditureAmount, event.budgetExpenditureAmount);
		this.maxIncomeAmount = Math.max(event.incomeAmount, event.budgetIncomeAmount);

		this.event = event;

		if (this.isMunicipality) {
			this.history = await this.dataService.getProfileEventHistory(this.profile.id, this.eventId)
		} else {
			const aa = Number(this.eventId.toString().substring(0, 3))
			const sa = Number(this.eventId.toString().substring(3))
			this.history =  await this.dataService.getProfileAaHistory(this.profile.id, aa, sa)
		}

		this.maxHistoryAmount = this.history.reduce((acc, cur) => Math.max(acc, cur.expenditureAmount, cur.incomeAmount, cur.budgetExpenditureAmount, cur.budgetIncomeAmount), -Infinity);


		if (this.event.items) {
			this.expenditureItems = this.event.items.filter(item => item.expenditureAmount > 0 || item.budgetExpenditureAmount > 0);
			this.incomeItems = this.event.items.filter(item => item.incomeAmount > 0 || item.budgetIncomeAmount > 0);

			this.expenditureItems.sort((a, b) => b.budgetExpenditureAmount - a.budgetExpenditureAmount);
			this.incomeItems.sort((a, b) => b.budgetIncomeAmount - a.budgetIncomeAmount);
		}

		if (this.event.paragraphs) {
			this.expenditureParagraphs = this.event.paragraphs.filter(paragraph => paragraph.expenditureAmount > 0 || paragraph.budgetExpenditureAmount > 0)
			this.expenditureParagraphs.sort((a, b) => b.budgetExpenditureAmount - a.budgetExpenditureAmount);
		}

		if (this.event.payments) {

			this.event.payments.sort((a, b) => a.date && b.date ? a.date.localeCompare(b.date) : 0);

			const counterparties: Counterparty[] = [];
			const counterpartyIndex: { [id: string]: Counterparty } = {}
			const noCounterparty = new Counterparty(null, "bez protistrany")

			this.event.payments.forEach(payment => {
				let counterparty = payment.counterpartyId ? counterpartyIndex[payment.counterpartyId] : noCounterparty;
				if (!counterparty) {
					counterparty = new Counterparty(payment.counterpartyId, payment.counterpartyName);
					counterpartyIndex[payment.counterpartyId] = counterparty
					counterparties.push(counterparty);
				}
				counterparty.amount += (payment.incomeAmount - payment.expenditureAmount);
				counterparty.payments.push(payment);
			});

			counterparties.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));

			if (noCounterparty.payments.length) counterparties.push(noCounterparty);

			this.counterparties = counterparties.map(counterparty => Object.assign(counterparty, { open: false }));
		}
	}

	openYear(year: number) {
		this.year = year;
		this.loadEvent(this.profile.id, this.eventId, this.year);
	}

	openPayments(counterparty) {
		counterparty.open = !counterparty.open;
	}

	get isMunicipality() {
		return this.profile.type === "municipality"
	}

}