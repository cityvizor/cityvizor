import { Component, OnInit} from '@angular/core';

@Component({
	moduleId: module.id,
  selector: 'front-page',
	templateUrl: 'front-page.template.html',
	styles: [`
		#frontImage{padding:20px;}
		.box{background-color:rgba(255,255,255,.7);border-radius:5px;font-size:10pt;}
		.box.padding{padding:20px;}
		::-webkit-input-placeholder {
			 color: rgba(255,255,255,0.5);
		}
		:-moz-placeholder { /* Firefox 18- */
			 color: rgba(255,255,255,0.5);  
		}
		::-moz-placeholder {  /* Firefox 19+ */
			 color: rgba(255,255,255,0.5);  
		}
		:-ms-input-placeholder {  
			 color: rgba(255,255,255,0.5);  
		}
		textarea:focus, input:focus{
				outline: none;
		}

		#headerVyberObce {
			display: block;  padding: 50px 0px 20px 0px;
			background: url('http://janvlasaty.name/polepozadi.jpg') no-repeat; 
			background-size: 100% auto; background-position: center -115px; 
			text-align: center;
			border-bottom: 5px solid #eee;
			min-height: 330px;
		}
		@media (max-width: 1200px) {
				#headerVyberObce {
						background-size: 1200px auto; /* Force the image to its minimum width */
				}
		}
		#inputVyberObce {
			font-size: 80px; border: none; background: none;
			border-bottom: 3px dotted rgba(255,255,255,.75);
			color: rgba(255, 255, 255, 1);
			text-align: center;
			margin-bottom: 20px;
			max-width: 800px; padding: 0px 10px;
			margin: 0 auto;
		}
	`]
})
export class FrontPageComponent implements OnInit {
	headerImage = "http://data.mfcr.cz/sites/default/files/theme/backgrounds/IMG_5278_wide.JPG"
	
	search: string;

	ngOnInit() {

	}
}