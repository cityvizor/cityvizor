import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from 'app/services/data.service';
import { ToastService } from "app/services/toast.service";

import { environment } from "environments/environment";
import { Profile } from 'app/schema';

@Component({
	selector: 'profile-search',
	templateUrl: 'profile-search.component.html',
	styleUrls: ['profile-search.component.scss']
})
export class ProfileSearchComponent implements OnInit {

	profiles: Profile[] = [];
	hoverProfile: Profile | null;

	// Prague: mapGPSBounds = { "lat": { "min": 49.9476767, "max": 50.1774944 }, "lng": { "min": 14.2244208, "max": 14.7070583 } };
	mapGPSBounds = { "lat": { "min": 48.5525, "max": 51.0556 }, "lng": { "min": 12.0914, "max": 18.8589 } };

	loading: boolean = false;

	constructor(private dataService: DataService, private toastService: ToastService, private router: Router) { }

	ngOnInit() {
		this.loadProfiles();
	}

	async loadProfiles() {

		this.loading = true;

		const profiles: Profile[] = await this.dataService.getProfiles();

		this.loading = false;

		profiles.sort((a, b) => {
			if (a.status === "pending" && b.status !== "pending") return 1;
			if (a.status !== "pending" && b.status === "pending") return -1;
			return a.name.localeCompare(b.name, undefined, { numeric: true });
		});

		this.profiles = profiles.filter(profile => profile.status !== "preview");

	}

	gps2css(gpsX, gpsY) {
		let bounds = this.mapGPSBounds;
		return {
			bottom: (gpsY - bounds.lat.min) / (bounds.lat.max - bounds.lat.min) * 100 + "%",
			left: (gpsX - bounds.lng.min) / (bounds.lng.max - bounds.lng.min) * 100 + "%"
		};
	}

	openProfile(profile) {
		this.router.navigate(['/' + profile.url]);
	}

	openPending(profile, event: MouseEvent) {
		if (event.shiftKey) this.router.navigate(["/" + profile.url]);
		event.preventDefault();
	}

	getProfileAvatarUrl(profile: Profile) {
		return this.dataService.getProfileAvatarUrl(profile);
	}

}
