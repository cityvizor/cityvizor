import { Injectable, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';

import { ImportedData } from 'app/shared/schema';

type RegExpWithGroups = RegExpExecArray & { groups?: { [key: string]: string } };

@Injectable({
	providedIn: 'root'
})
export class ImportService {

	progress: Subject<number> = new Subject();

	worker: Worker;

	constructor(private appRef: ApplicationRef) {
		this.worker = new Worker("worker.js");
	}

	async importCityVizor(files: { events: File, data: File }): Promise<ImportedData> {
		return this.runImport("cityvizor", files)
	}


	async importGordic(files: { budget: File, accounting: File, events: File }): Promise<ImportedData> {
		return this.runImport("ginis", files)
	}


	runImport(importer: string, files: { [key: string]: File }): Promise<ImportedData> {
		return new Promise((resolve, reject) => {
			this.worker.postMessage({ "type": "import", "importer": importer, files })

			this.worker.onmessage = (event: MessageEvent) => {

				console.log("Received event:", event);
				switch (event.data.type) {
					case "progress":
						this.progress.next(event.data.data);
						break;
					case "data":
						resolve(event.data.data);						
						break;
				}
			};

			this.worker.onerror = (err: ErrorEvent) => reject(err);
		})
	}


}