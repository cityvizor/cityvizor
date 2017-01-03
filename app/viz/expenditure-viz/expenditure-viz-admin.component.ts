import { Component, Input } from '@angular/core';

import { DataService } from '../../services/data.service';
import { ToastService } 		from '../../services/toast.service';

import { FileUploader} from 'ng2-file-upload/ng2-file-upload';

@Component({
	moduleId: module.id,
	selector: 'expenditure-viz-admin',
	templateUrl: 'expenditure-viz-admin.template.html',
	styles: []
})
export class ExpenditureVizAdminComponent{
	
	@Input()
	set profile(profile){
		if(profile && profile._id) this.uploader = this._ds.getExpendituresUploader(profile._id,this.year);
		else this.uploader = null;
	}

	year = 2016;

	public uploader:FileUploader;
	public upload:any;

	constructor(private _ds: DataService, private _toastService: ToastService){}

	startUpload(){
		
		var upload = this.uploader.queue[this.uploader.queue.length - 1];
		upload.upload();
		this.upload = upload;

	}

}