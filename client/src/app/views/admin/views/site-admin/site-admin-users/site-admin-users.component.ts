import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { DataService } from 'app/services/data.service';
import { ToastService } from 'app/services/toast.service';

import { User } from "app/schema/user";

@Component({
	selector: 'site-admin-users',
	templateUrl: 'site-admin-users.component.html',
	styleUrls: ['site-admin-users.component.scss']
})
export class SiteAdminUsersComponent {

	// variable to store users
	users: User[] = [];

	currentUser: User | null = null;

	roles: string[] = ["admin", "profile-manager"];

	newUser: boolean = false;

	userLoading: boolean = false;

	constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private toastService: ToastService) {
	}

	ngOnInit() {

		this.loadUsers();

		this.route.params.forEach((params: Params) => {

			if (params["user"]) this.loadUser(params["user"]);
			else this.currentUser = null;

		});
	}

	loadUsers() {
		this.dataService.getUsers()
			.then(users => {
				this.users = users;
				this.users.sort((a, b) => a.id > b.id ? 1 : (a.id < b.id ? -1 : 0));
			})
			.catch(err => {
				this.toastService.toast("Nastala neznámá chyba při načítání uživatelů.", "error");
			});
	}

	loadUser(userId) {

		if (!userId) return;

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
				this.toastService.toast("Nastala neznámá chyba při načítání uživatele.", "error");
			});
	}

	async createUser() {

		var login = window.prompt("Zadejte login nového uživatele:");

		if (!login) return;

		// check if username does not exist
		try {
			const existingUser = await this.dataService.getUser(login)

			if (existingUser) {
				this.toastService.toast("Uživatel s tímto e-mailem již existuje.", "notice");
				this.selectUser(existingUser.id);
				return;
			}
		}
		catch (err) {
			if (err.status !== 404) throw err; // ignore not found, that is what we want
		}

		let userData = { login };

		const user = await this.dataService.createUser(userData);

		this.toastService.toast("Uživatel vytvořen.", "notice");
		this.loadUsers();
		this.selectUser(user.id);
	}

	saveUser(userData) {
		this.dataService.saveUser(userData)
			.then(() => {
				this.toastService.toast("Uloženo.", "notice");
				this.loadUsers();
			});
	}

	async deleteUser(userId) {
		await this.dataService.deleteUser(userId)

		if (this.currentUser && this.currentUser.id === userId) this.selectUser(null);

		this.loadUsers();

		this.toastService.toast("Uživatel smazán.", "notice");
	}

	getUserLink(userId) {
		return userId ? ["./", { user: userId }] : ["./", {}];
	}

	selectUser(userId) {
		this.router.navigate(this.getUserLink(userId), { relativeTo: this.route });
	}

}