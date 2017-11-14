import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ToastService } from "../../../services/toast.service";
import { DataService } from "../../../services/data.service";

@Component({
	moduleId: module.id,
	selector: 'profile-admin-avatar',
	templateUrl: 'profile-admin-avatar.template.html',
	styleUrls: ['profile-admin-avatar.style.css']
})
export class ProfileAdminAvatarComponent {

  @Input()
	set profile(profile: any){
    this._profile = profile;
    this.updateAvatar(profile._id,profile.avatarExt);
  }
  
  _profile:any;
       
  avatarPath:string;
  
  tooBig:boolean = false;
	 
	constructor(private toastService:ToastService, private dataService:DataService) {
	}
  
  updateAvatar(profileId:string,ext:string):void{  
    this.avatarPath = ext ? '/data/uploads/avatars/' + profileId + ext + "?" + new Date().getTime() : null;
  }
	 
	save(avatarFile){
    
    let file = avatarFile.files[0];
    
    let formData: FormData = new FormData();
    
    formData.set("avatar",file,file.name);
    
    if(file.size && file.size / 1024 >= 100) {
      this.tooBig = true;
      return;
    }
    else this.tooBig = false;
      
    
    this.dataService.saveProfileAvatar(this._profile._id,formData)
			.then(result => {
        this.toastService.toast("Logo obce uloženo","check");
        let ext = "." + file.name.split('.').pop();
        this._profile.avatarExt = ext;
        this.updateAvatar(this._profile._id,ext);
        avatarFile.value = "";
      })
			.catch(response => {
        this.toastService.toast("Nastala chyba při ukládání loga","error");
			});
    
	}
  
  delete(){
    this.dataService.deleteProfileAvatar(this._profile._id)
			.then(result => {
        this.toastService.toast("Logo obce smazáno","check");
        let ext = null;
        this._profile.avatarExt = ext;
        this.updateAvatar(this._profile._id,ext);
      })
			.catch(err => {
        this.toastService.toast("Nastala chyba při mazání loga: " + err.message,"error");
			});
  }

}