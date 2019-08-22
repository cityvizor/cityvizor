import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ToastService } from "../../../services/toast.service";
import { DataService } from "../../../services/data.service";

@Component({
	moduleId: module.id,
	selector: 'profile-admin-avatar',
	templateUrl: 'profile-admin-avatar.component.html',
	styleUrls: ['profile-admin-avatar.component.scss']
})
export class ProfileAdminAvatarComponent {

  @Input()
	set profile(profile: any){
    this._profile = profile;
    this.updateAvatar(profile.id);
  }
  
  _profile:any;
       
  avatarPath:string;
  
  tooBig:boolean = false;
	 
	constructor(private toastService:ToastService, private dataService:DataService) {
	}
  
  updateAvatar(profileId:string):void{  
    this.avatarPath = "/api/profiles/" + profileId + "/avatar" + "?" + new Date().getTime();
  }
	 
	save(avatarFile){
    
    let file = avatarFile.files[0];
    
    let formData: FormData = new FormData();
    
    formData.set("avatar",file,file.name);
    
    if(file.size && file.size / 1024 / 1024 > 1) {
      this.tooBig = true;
      return;
    }
    else this.tooBig = false;
      
    
    this.dataService.saveProfileAvatar(this._profile.id,formData)
			.then(result => {
        this.toastService.toast("Logo obce uloženo","check");
        this.updateAvatar(this._profile.id);
        avatarFile.value = "";
      })
			.catch(response => {
        this.toastService.toast("Nastala chyba při ukládání loga","error");
			});
    
	}
  
  delete(){
    this.dataService.deleteProfileAvatar(this._profile.id)
			.then(result => {
        this.toastService.toast("Logo obce smazáno","check");
        this.updateAvatar(this._profile.id);
      })
			.catch(err => {
        this.toastService.toast("Nastala chyba při mazání loga: " + err.message,"error");
			});
  }

}