import { Injectable, EventEmitter } from '@angular/core';
import { Papa } from 'ngx-papaparse';

import { ToastService } from "app/services/toast.service";

import { AccountingData, ImportedData, AccountingEvent, AccountingRecord, Balances, TreeBudgetParagraph, TreeBudgetEvent, TreeBudgetItem } from 'app/shared/schema';
import { TreeBudget } from 'app/shared/schema';

/* DEMO DATA SERVICE */

@Injectable({
	providedIn: "root"
})
export class DataService {

	public profile: any = {
		_id: "abc",
		name: "Moje obec"
	};

	public year: number = (new Date()).getFullYear();

	profileYear = { profile: this.profile._id, year: this.year };

	data: AccountingData = new AccountingData();

	loaded: boolean = false;

	constructor(private papa: Papa, private toastService:ToastService) {
	}


	async getProfile(profileId: string) {
		return this.profile;
	}

	async saveData(data: ImportedData) {
		this.data = new AccountingData();

		// save data and create new IDs. Here data are duplicated for some time, FIX if causes memory problems
		this.data.records = data.records.map((record, i) => ({ _id: "record_" + i, ...this.profileYear, ...record, event: record.event ? String(record.event) : null }));
		this.data.payments = data.payments.map((payment, i) => ({ _id: "payment_" + i, ...this.profileYear, ...payment, event: payment.event ? String(payment.event) : null }));
		this.data.events = data.events.map((event, i) => ({ _id: String(event.srcId), ...this.profileYear, ...event }));		
    
		this.toastService.toast("Data uložena v prohlížeči. Nic nebylo odesláno mimo tento počítač.","notice");
		
		this.loaded = true;
	}

	async deleteData(){
		this.data = new AccountingData();
		this.loaded = false;

		this.toastService.toast("Data byla vymazána z paměti prohlížeče.","notice");
	}

	async getProfileBudget(profileId, year): Promise<TreeBudget> {

		const budget: TreeBudget = {
			...this.profileYear,
			...this.sumBalances(),
			paragraphs: [],
			items: []
		}

		const paragraphIndex = {}
		const paragraphEventIndex = {};
		this.data.records.forEach(record => {

			if (record.paragraph < 1000) return;
			if (!record.amount && !record.budgetAmount) return;

			var paragraph = paragraphIndex[record.paragraph];
			if (!paragraph) {
				paragraph = paragraphIndex[record.paragraph] = new TreeBudgetParagraph(record.paragraph);
				budget.paragraphs.push(paragraph)
			}
			this.addBalances(record, paragraph);

			if (record.event) {
				const id = record.paragraph + "-" + record.event;
				var event = paragraphEventIndex[id];
				if (!event) {
					event = paragraphEventIndex[id] = new TreeBudgetEvent(record.event);
					paragraph.events.push(event);
				}
				this.addBalances(record, event);
			}
		});

		const itemIndex = {}
		const itemEventIndex = {};
		this.data.records.forEach(record => {

			if (record.item < 1000) return;
			if (!record.amount && !record.budgetAmount) return;

			var item = itemIndex[record.item];
			if (!item) {
				item = itemIndex[record.item] = new TreeBudgetItem(record.item);
				budget.items.push(item)
			}
			this.addBalances(record, item);

			if (record.event) {
				const id = record.item + "-" + record.event;
				var event = itemEventIndex[id];
				if (!event) {
					event = itemEventIndex[id] = new TreeBudgetEvent(record.event);
					item.events.push(event);
				}
				this.addBalances(record, event);
			}
		})

		return budget;
	}

	async getProfileBudgets(profileId: string, options?: any) {
		const budget = {
			year: this.year,
			...this.sumBalances()
		};

		return [budget];
	}

	async getEvent(eventId: number) {
		const eventInfo = this.data.events.find(event => event._id === String(eventId));
		const event = {
			...eventInfo,
			...this.sumBalances((record) => record.event === String(eventId)),
			paragraphs: [],
			items: [],
			payments: this.data.payments.filter(payment => payment.event === String(eventId))
		};

		const paragraphIndex = {};
		const itemIndex = {};
		this.data.records
			.filter(record => record.event === String(eventId))
			.forEach(record => {
				if (!record.amount && !record.budgetAmount) return;

				if (record.paragraph) {
					var paragraph = paragraphIndex[record.paragraph];
					if (!paragraph) {
						paragraph = paragraphIndex[record.paragraph] = new TreeBudgetParagraph(record.paragraph);
						event.paragraphs.push(paragraph);
					}
					this.addBalances(record, paragraph);
				}

				var item = itemIndex[record.item];
				if (!item) {
					item = itemIndex[record.item] = new TreeBudgetItem(record.item);
					event.items.push(item);
				}
				this.addBalances(record, item);
			});

		return event;
	}

	async getEventPayments(eventId: string) {
		return this.data.payments.filter(payment => payment.event === eventId);
	}

	async getProfileEvents(profileId, options?) {
		return this.data.events.filter(item => options.srcId ? item.srcId === options.srcId : true);
	}

	async getProfilePaymentsMonths(profileId) {
		return [];
	}

	async getProfilePayments(profileId, options?) {
		return {};
	}


	// ORIGINAL
	async getEvents(options?) {
		return [];
	}

	// methods from DataService not implemented in DemoDataService
	async getProfiles(options) { return []; }
	async createProfile(profile) { return; }
	async saveProfile(profile) { }
	async saveProfileAvatar(profileId, data: FormData) { return ""; }
	async getProfileContracts(profileId, options?) { }
	async deleteProfileAvatar(profileId) { return ""; }
	async deleteProfileBudget(profileId, year) { return ""; }
	async getProfileDashboardDashboard() { }
	async getProfileManagers(profileid) { return []; }
	async getProfileNoticeBoard() { return []; }
	async getUsers() { }
	async getUser() { }
	async saveUser() { }
	async deleteUser(userId) { return {}; }
	async getETLs() { }
	async getLatestETLs() { }

	/* HELPER METHODS */
	sumBalances(filter?: (record: AccountingRecord) => boolean): Balances {

		if (!filter) filter = () => true;

		const balances: Balances = {
			incomeAmount: 0,
			budgetIncomeAmount: 0,
			expenditureAmount: 0,
			budgetExpenditureAmount: 0
		};

		this.data.records
			.filter(filter)
			.forEach(record => this.addBalances(record, balances))

		return balances;
	}

	addBalances(record: AccountingRecord, target: Balances) {
		if (record.item > 5000) {
			target.expenditureAmount += record.amount;
			target.budgetExpenditureAmount += record.budgetAmount;
		}
		else {
			target.incomeAmount += record.amount;
			target.budgetIncomeAmount += record.budgetAmount;
		}
	}
}