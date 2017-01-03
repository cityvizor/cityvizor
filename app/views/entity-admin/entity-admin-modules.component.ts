import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ToastService } 		from '../../services/toast.service';
import { DataService } 		from '../../services/data.service';

import { Module, MODULES } from "../../shared/data/modules";

@Component({
	moduleId: module.id,
	selector: 'entity-admin-modules',
	templateUrl: 'entity-admin-modules.template.html',
	styles: [],
})
export class EntityAdminModulesComponent {

	@Input()
	profile: any;
	 
	@Output() save = new EventEmitter();

	modules: Module[];

	constructor(private _ds: DataService, private _toastService: ToastService) {
		this.modules = MODULES;
	}

	setViewState(viz: Module,value: boolean){
		this.profile.modules[viz.id] = value;
		this.save.emit();
	}

}