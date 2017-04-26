import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { DataService } 		from '../../../services/data.service';
import { ToastService } 		from '../../../services/toast.service';

import { User } from "../../../shared/schema/user";

//00006947
@Component({
	moduleId: module.id,
	selector: 'site-admin-users',
	templateUrl: 'site-admin-users.template.html',
	styleUrls: ['site-admin-users.style.css']
})
export class SiteAdminUsersComponent {
  
  // variable to store users
  users:User[] = [];

	currentUser:User = null;

	roles:string[] = ["admin","profile-manager"];

	newUser:boolean = false;

	userLoading:boolean = false;

	constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private toastService: ToastService) {
	}
  
  ngOnInit(){
		
		this.loadUsers();

		this.route.params.forEach((params: Params) => {		
			
			if(params["user"]) this.loadUser(params["user"]);
			else this.currentUser = null;
			
		});
	}
	
	loadUsers(){
		this.dataService.getUsers()
      .then(users => {
        this.users = users;
        this.users.sort((a,b) => a._id > b._id ? 1 : (a._id < b._id ? -1 : 0));
      })
			.catch(err => {
				this.toastService.toast("Nastala neznámá chyba při načítání uživatelů.","error");
			});
	}
	
	loadUser(userId){
		
		if(!userId) return;
		
		this.userLoading = true;
		this.currentUser = null;
		
		this.dataService.getUser(userId)
      .then(user => {
        this.currentUser = user;
				this.newUser = false;
				this.userLoading = false;
      })
			.catch(err => {
				this.userLoading = false;
				this.toastService.toast("Nastala neznámá chyba při načítání uživatele.","error");
			});
	}

	createUser(){
		
		var id = window.prompt("Zadejte e-mail nového uživatele:");
		
		if(id){
			// check if username does not exist
			this.dataService.getUser(id)
				.then(user => {
					if(user){
						this.toastService.toast("Uživatel s tímto e-mailem již existuje.","notice");
						this.selectUser(user._id);
						return;
					}
					else{
						let newUser = new User(id);
						this.dataService.saveUser(newUser)
							.then(user => {
								this.toastService.toast("Uživatel vytvořen.","notice");
								this.loadUsers();
								this.selectUser(user._id);
							})
							.catch(err => this.toastService.toast("Nastala chyba při vytváření uživatele.","notice"));
					}
				})
				.catch(err => this.toastService.toast("Nastala chyba při kontrole e-mailu.","notice"));
		}
	}

	saveUser(userData){
		this.dataService.saveUser(userData)
			.then(() => {
			this.toastService.toast("Uloženo.","notice");
			this.loadUsers();
		});
	}

	deleteUser(userId){
		this.dataService.deleteUser(userId)
			.then(() => {
			if(this.currentUser._id === userId) this.selectUser(null);
			this.loadUsers();
			this.toastService.toast("Uživatel smazán.","notice");
		})
			.catch(err => this.toastService.toast("Nastala chyba při mazání uživatele.","notice"));
	}

	getUserLink(userId){
		return userId ? ["./",{user:userId}] : ["./",{}];
	}

	selectUser(userId){
		this.router.navigate(this.getUserLink(userId),{relativeTo:this.route});
	}

}