import { Component, ChangeDetectorRef } from '@angular/core';

import { DataService } from 'app/services/data.service';
import { ImportService } from 'app/services/import.service';
import { ToastService } from 'app/services/toast.service';

import { ImportedData, ImportedPayment } from 'app/shared/schema';
import { Router } from '@angular/router';
import { ExportService } from 'app/services/export.service';

import { PersonalDataCheck, PersonalDataCheckWarning } from "@smallhillcz/personal-data-check";
import { cs } from "@smallhillcz/personal-data-check/lib/regional/cs";

// As ugly as this import may be, it also enables hot-reloading when the referenced file changes.
import { ImporterGinis } from '../../../../../import/importers/importer-ginis'
@Component({
	selector: 'import',
	templateUrl: './import.component.html',
	styleUrls: ['./import.component.scss']
})
export class ImportComponent {

	step: "input" | "progress" | "confirmation" | "status";
	confirmationTab: "warnings" | "data" = "warnings";

	importType: string = "cityvizor";

	warnings: { payment: ImportedPayment, messages: PersonalDataCheckWarning[] }[] = [];

	progress: number;

	data: ImportedData;

	totals = { budgetIncome: 0, budgetExpenditure: 0, income: 0, expenditure: 0 };

	exportOptions = {
		"utf": { encoding: "utf-8", delimiter: ",", newline: "\r\n" },
		"excel": { encoding: "win1250", delimiter: ";", newline: "\r\n" }
	};

	syntheticAccount: number;
	downloadingEvents: boolean = false;

	constructor(private importService: ImportService, private exportService: ExportService, private dataService: DataService, private toastService: ToastService, private router: Router, cdRef: ChangeDetectorRef) {

		this.step = dataService.loaded ? "status" : "input";

		this.importService.progress.subscribe(progress => {
			this.progress = Math.floor(progress * 100);
			cdRef.markForCheck();
		});
	}

	async importCityvizor(inputData: HTMLInputElement, inputEvents: HTMLInputElement) {

		const files = {
			data: inputData.files[0],
			events: inputEvents.files[0]
		};

		this.step = "progress";

		this.data = await this.importService.importCityvizor(files);

		this.step = "confirmation";

		this.checkData();
	}

	async importGinis(inputBudget: HTMLInputElement, inputAccounting: HTMLInputElement, inputEvents: HTMLInputElement) {

		const files = {
			budget: inputBudget.files[0],
			accounting: inputAccounting.files[0],
			events: inputEvents.files[0]
		}

		this.step = "progress";
		await ImporterGinis.validate(files).catch(e => {
			alert(`Při validaci nahraných dat došlo k následující chybě: \n${e}\nImport a analýza dat se nemusí povést a výsledky mohou být chybné či neúplné.`);
		});
		this.data = await this.importService.importGordic(files);
		this.step = "confirmation";
		this.checkData();

	}

	async importVera(inputAccounting: HTMLInputElement, inputBudget: HTMLInputElement) {

		const files = {
			accounting: inputAccounting.files[0],
			budget: inputBudget.files[0]
		}

		this.step = "progress";

		this.data = await this.importService.importVera(files);

		this.step = "confirmation";

		this.checkData();

	}



	async saveData() {
		await this.dataService.saveData(this.data);

		this.step = "status";

		delete this.data;
	}

	async deleteData() {
		await this.dataService.deleteData();
		this.warnings = [];
		this.step = "input";
	}

	persistData() {
		this.dataService.persistData();
	}

	checkData() {
		this.updateTotals();
		this.sortData();
		this.checkPayments();
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

	checkPayments() {
		const gdpr = new PersonalDataCheck(cs);

		this.data.payments.forEach(payment => {
			const messages = gdpr.check(payment.description);
			if (messages.length) this.warnings.push({ payment, messages })
		});
	}

	getHighlightedWarnings(text: string, warnings: PersonalDataCheckWarning[]): string {
		warnings.forEach(warning => text = text.replace(warning.value, "<span class=\"bg-warning\">" + warning.value + "</span>"));
		return text;
	}

	exportCityVizorData(optionsName: string) {
		this.exportService.exportCityVizorData(this.dataService.data)
	}
	exportCityVizorEvents(optionsName: string) {
		this.exportService.exportCityVizorEvents(this.dataService.data, Number(this.syntheticAccount))
	}
	exportRecords() {
		this.exportService.exportRecords(this.data.records, {
			...this.exportOptions["excel"],
			header: {
				paragraph: "Paragraf",
				item: "Položka",
				event: "Akce (ORG)",
				unit: "Jednotka (ORJ)",
				budgetAmount: "Rozpočet",
				amount: "Plnění"
			}
		})
	}
	exportPayments() {
		const data = this.data.payments.map(payment => ({
			...payment,
			type: payment.type === "invoice_incoming" ? "Přijatá faktura" : "Vydaná faktura"
		}));
		this.exportService.exportPayments(data, {
			...this.exportOptions["excel"],
			header: {
				type: "Typ záznamu",
				paragraph: "Paragraf",
				item: "Položka",
				event: "Akce (ORG)",
				unit: "Jednotka (ORJ)",
				amount: "Částka",
				date: "Datum",
				counterpartyId: "IČO protistrany",
				counterpartyName: "Název protistrany",
				description: "Popis"
			}
		})
	}
	exportEvents() {
		this.exportService.exportEvents(this.data.events, {
			...this.exportOptions["excel"],
			header: {
				srcId: "Číslo akce",
				name: "Název akce"
			}
		})
	}

	openEventDownloadMenu() {
		if (this.dataService.distinctEventSyntheticAccounts.includes(231)) this.syntheticAccount = 231
		this.downloadingEvents = true;
	}

}