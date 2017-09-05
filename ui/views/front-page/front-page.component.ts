import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title }     from '@angular/platform-browser';

import { DataService} from '../../services/data.service';
import { AppConfig } from '../../config/app-config';

@Component({
	moduleId: module.id,
  selector: 'front-page',
	templateUrl: 'front-page.template.html',
	styleUrls: ['front-page.style.css']
})
export class FrontPageComponent implements OnInit {
	
	profiles = [];
	hoverProfile:any;
	search: RegExp;
	
	czechRepublicGPSBounds = {"lat": {"min":48.5525,"max":51.0556}, "lng":{"min":12.0914,"max":18.8589}};
	
	config:any = AppConfig;

	constructor(private titleService: Title, private _ds: DataService, private _router: Router) { }

	ngOnInit(){
		
		this.titleService.setTitle(this.config.title);
		
		this._ds.getProfiles().then(profiles => {
			profiles.forEach(profile => {
				profile.searchString = this.cleanString(profile.name);
				profile.avatarPath = profile.avatarExt ? this.config.avatarsUrl + "/" + profile._id + profile.avatarExt : null;
			});
			profiles.sort((a,b) => a.searchString.localeCompare(b.searchString));
			this.profiles = profiles;
		});
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