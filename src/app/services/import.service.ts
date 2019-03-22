import { Injectable, ApplicationRef } from '@angular/core';
import { Subject } from 'rxjs';

import { ImportedData } from 'app/shared/schema';
import { ImporterGinis } from 'app/importers/importer-ginis';

type RegExpWithGroups = RegExpExecArray & { groups?: { [key: string]: string } };

@Injectable({
	providedIn: 'root'
})
export class ImportService {

	progress: Subject<number> = new Subject();

	constructor(private appRef: ApplicationRef) { }

	async importCityVizor(files: { events: File, data: File }): Promise<ImportedData> {
		return {
			payments: [],
			records: [],
			events: []
		}
	}


	async importGordic(files: { budget: File, accounting: File, events: File }): Promise<ImportedData> {

		const importer = new ImporterGinis(this.appRef);

		const progressSubscription = importer.progress.subscribe(this.progress);

		const data = await importer.import(files);

		progressSubscription.unsubscribe();

		return data;

	}


}



/*

export class CityVizorParser {

	constructor() {
	}

	parseEvents(eventsFile) {
		return new Promise((resolve, reject) => {

			if (!eventsFile) return resolve(this.importer);

			var c = 1;
			this.papa.parse(eventsFile, {
				header: true,
				step: (result, parser) => this.importer.writeEvent(result.data[0], c++),
				complete: (results, file) => resolve(this.importer),
				error: (err, file) => reject(err)
			});

		});
	}

	parseData(dataFile) {

		return new Promise((resolve, reject) => {

			var c = 0;

			this.papa.parse(dataFile, {
				header: true,
				step: (result, parser) => {
					c++;
					let row = result.data[0];
					this.importer.writeBalance(row, c);
					if (row.type === "KDF" || row.type === "KOF") this.importer.writePayment(row, c);
				},
				complete: (results, file) => resolve(this.importer),
				error: (err, file) => reject(err)
			});


		});

	}
}
*/