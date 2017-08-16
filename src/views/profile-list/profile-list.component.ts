import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataService} from '../../services/data.service';

@Component({
	moduleId: module.id,
	selector: 'profile-list',
	templateUrl: 'profile-list.template.html',
	styleUrls: ['profile-list.style.css']
})
export class ProfileListComponent{
	
	show: string = "map";
	
	letters = [];
	profiles = [];
	
	type: string;

	mapSize = {"width": 973.53, "height":553.6};

	hoverProfile:any;

	/*
	50.251944, 12.091389 Z
	49.550278, 18.858889 V
	51.055556, 14.316111 S
	48.5525, 14.333056 J
	*/
	czechRepublicGPSBounds = {"lat": {"min":48.5525,"max":51.0556}, "lng":{"min":12.0914,"max":18.8589}};
	
	search: RegExp;

	listColumns: number = 3;

	constructor(private _ds: DataService, private _router: Router) { }

	ngOnInit(){
		this._ds.getProfiles().then(profiles => {
			this.profiles = profiles;
			this.makeList(profiles);
		});
	}

	gps2mapLat (c) {
		return this.mapSize.height*(this.czechRepublicGPSBounds.lat.max-c)/(this.czechRepublicGPSBounds.lat.max-this.czechRepublicGPSBounds.lat.min);
	}
	gps2mapLng (c) {
		return this.mapSize.width*(c-this.czechRepublicGPSBounds.lng.min)/(this.czechRepublicGPSBounds.lng.max-this.czechRepublicGPSBounds.lng.min);
	}
	gps2css(gps){
		let bounds = this.czechRepublicGPSBounds;
		return {
			bottom: (gps[1] - bounds.lat.min) / (bounds.lat.max - bounds.lat.min) * 100 + "%",
			left: (gps[0] - bounds.lng.min) / (bounds.lng.max - bounds.lng.min) * 100 + "%"
		};
	}

	gps2string(gps):string {
		if(!gps) return "";
		let dg = gps.map(n => Math.round(n)); // get degrees
		let mn = gps.map(n => Math.round((n % 1) * 60 * 1000) / 1000); // get minutes
		let st = [0,1].map(i => dg[i] + "° " + mn[i] + "'"); // get string
		return "N " + st[1] + ", E " + st[0] + "'"; // concatenate
	}

	makeList(profiles){
		
		this.letters = [];
		
		profiles.forEach((profile,i) => {
			
			profile.searchString = this.cleanString(profile.name);
			
			var letter = profile.searchString.substring(0,1).toUpperCase();
			if(profile.searchString.substring(0,2).toUpperCase() === "CH") letter = "CH";
			if(!letter.match(/^\w+$/)) letter = "#";
			
			var pushProfile = this.letters.some(item => {
				if(item.letter === letter) {
					item.profiles.push(profile);
					return true;
				}
			});
			
			if(!pushProfile) this.letters.push({
				"letter": letter,
				profiles: [profile]
			});
				
		});
		
		this.letters.sort((a,b) => a.letter < b.letter ? -1 : (a.letter > b.letter ? 1 : 0));
		
	}

	cleanString(value:string):string{
		
		if(!value) return "";
		
		var sdiak="áäčďéěíĺľňóôőöŕšťúůűüýřžÁÄČĎÉĚÍĹĽŇÓÔŐÖŔŠŤÚŮŰÜÝŘŽ234567890[;";
		var bdiak="aacdeeillnoooorstuuuuyrzAACDEEILLNOOOORSTUUUUYRZescrzyaieuu";

		var searchString = "";

		for(var p = 0; p < value.length; p++){
			if(sdiak.indexOf(value.charAt(p)) !== -1) searchString += bdiak.charAt(sdiak.indexOf(value.charAt(p)));
			else searchString += value.charAt(p);
		}

		searchString = searchString.toLowerCase();
		
		return searchString;
		
	}

	makeSearchString(value: string):RegExp{
		
		return new RegExp("(?:^| )" + this.cleanString(value));
		
	}

	openProfile(profile){
		this._router.navigate(['/' + profile.url]);
	}

}