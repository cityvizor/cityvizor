import { Component, OnInit} from '@angular/core';

@Component({
	moduleId: module.id,
  selector: 'front-page',
	templateUrl: 'front-page.template.html',
	styles: [`
		#frontImage{padding:20px;}
		.box{background-color:rgba(255,255,255,.7);border-radius:5px;font-size:10pt;}
		.box.padding{padding:20px;}
	`]
})
export class FrontPageComponent implements OnInit {
	headerImage = "http://data.mfcr.cz/sites/default/files/theme/backgrounds/IMG_5278_wide.JPG"

	ngOnInit() {

	}
}