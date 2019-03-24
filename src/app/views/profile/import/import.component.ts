import { Component, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { DataService } from 'app/services/data.service';
import { ImportService } from 'app/services/import.service';
import { ToastService } from 'app/services/toast.service';

import { ImportedData } from 'app/shared/schema';
import { Router } from '@angular/router';

@Component({
	selector: 'import',
	templateUrl: './import.component.html',
	styleUrls: ['./import.component.scss']
})
export class ImportComponent {

	step: string = "input";

	importType: string = "cityvizor";

	warnings: string[] = [];

	progress: number;

	data: ImportedData;

	totals = { budgetIncome: 0, budgetExpenditure: 0, income: 0, expenditure: 0 };

	constructor(private importService: ImportService, private dataService: DataService, private toastService: ToastService, private router: Router, cdRef: ChangeDetectorRef) {
		this.importService.progress.subscribe(progress => {
			this.progress = Math.floor(progress * 100);
			cdRef.markForCheck();
		});
	}

	async importCityVizor(inputData: HTMLInputElement, inputEvents: HTMLInputElement, encoding: string) {


		const files = {
			data: inputData.files[0],
			events: inputEvents.files[0]
		};

		this.step = "progress";

		this.data = await this.importService.importCityVizor(files);

		this.step = "confirmation";

		this.updateTotals();
		this.sortData();
	}

	async importGinis(inputBudget: HTMLInputElement, inputAccounting: HTMLInputElement, inputEvents: HTMLInputElement) {

		const files = {
			budget: inputBudget.files[0],
			accounting: inputAccounting.files[0],
			events: inputEvents.files[0]
		}

		this.step = "progress";

		this.data = await this.importService.importGordic(files);

		this.step = "confirmation";

		this.updateTotals();
		this.sortData();

	}

	async saveData() {
		await this.dataService.saveData(this.data);

		this.step = "input";

		delete this.data;

		this.router.navigate(["/profile/vydaje"]);
		this.toastService.toast("Data uložena v prohlížeči.","notice");
	}

	updateTotals() {
		this.data.records.forEach(record => {
			if (record.item > 5000) {
				this.totals.budgetExpenditure += record.budgetAmount;
				this.totals.expenditure += record.amount;
			}
			else {
				this.totals.budgetIncome += record.budgetAmount;
				this.totals.income += record.amount;
			}
		})
	}

	sortData() {
		this.data.records.sort((a, b) => a.paragraph - b.paragraph || a.item - b.item || Number(a.event) - Number(b.event));
	}


}