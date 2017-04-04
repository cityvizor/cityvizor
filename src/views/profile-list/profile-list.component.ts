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
	czechRepublicGPSBounds = {"lat": {"min":48.5525,"max":51.055556}, "lng":{"min":12.1008364,"max":18.8268292}};
	
	@Input()
	set search(value: string){
		this._search = this.cleanString(value);	
	}

	_search: string;

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

	makeList(profiles){
		
		this.letters = [];
		
		profiles.forEach((profile,i) => {
			
			profile.searchString = this.cleanString(profile.entity.name);
			
			var letter = profile.searchString.substring(0,1).toUpperCase();
			if(profile.searchString.substring(0,2).toUpperCase() === "CH") letter = "CH";
			if(!letter.match(/^\w+$/)) letter = "#";
			
			var pushEntity = this.letters.some(item => {
				if(item.letter === letter) {
					item.profiles.push(profile);
					return true;
				}
			});
			
			if(!pushEntity) this.letters.push({
				"letter": letter,
				profiles: [profile]
			});
				
		});
		
		this.letters.sort((a,b) => a.letter < b.letter ? -1 : (a.letter > b.letter ? 1 : 0));
		
	}

	cleanString(value: string){
		
		if(!value) return "";
		
		var sdiak="áäčďéěíĺľňóôőöŕšťúůűüýřžÁÄČĎÉĚÍĹĽŇÓÔŐÖŔŠŤÚŮŰÜÝŘŽ234567890[;";
		var bdiak="aacdeeillnoooorstuuuuyrzAACDEEILLNOOOORSTUUUUYRZescrzyaieuu";

		var output = "";

		for(var p = 0; p < value.length; p++){
			if(sdiak.indexOf(value.charAt(p)) !== -1) output += bdiak.charAt(sdiak.indexOf(value.charAt(p)));
			else output += value.charAt(p);
		}

		output = output.toLowerCase();

		return output;
	}

	openProfile(profile){
		this._router.navigate(['/profil',profile.url]);
	}

}