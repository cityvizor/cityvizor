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

	async importCityvizor(files: { events: File, data: File }, options?: any): Promise<ImportedData> {
		return this.runImport("cityvizor", files, options)
	}


	async importGordic(files: { budget: File, accounting: File, events: File }): Promise<ImportedData> {
		return this.runImport("ginis", files)
	}

	async importVera(files: { accounting: File, budget: File }): Promise<ImportedData> {
		return this.runImport("vera", files)
	}


	runImport(importer: string, files: { [key: string]: File }, options?: any): Promise<ImportedData> {
		return new Promise((resolve, reject) => {

			this.worker.postMessage({ "type": "import", "importer": importer, files, options })

			this.worker.onmessage = (event: MessageEvent) => {

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