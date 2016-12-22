import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ToastService } 		from '../../services/toast.service';
import { DataService } 		from '../../services/data.service';

import { Module } from "../../shared/schema/module";
import { MODULES } from "../../shared/data/modules";

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

	setViewState(view: string,value: boolean){
		this.profile.modules[view] = value;
		this.save.emit();
	}

}