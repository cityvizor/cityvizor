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

		header {
			display: block;  padding: 50px 0px 50px 0px;
			background: url('http://janvlasaty.name/polepozadi.jpg') no-repeat; 
			background-size: 100% auto; background-position: center -200px; 
			text-align: center;
			border-bottom: 5px solid #eee; 
		}
		@media (max-width: 1200px) {
				header {
						background-size: 1200px auto; /* Force the image to its minimum width */
				}
	`]
})
export class FrontPageComponent implements OnInit {
	headerImage = "http://data.mfcr.cz/sites/default/files/theme/backgrounds/IMG_5278_wide.JPG"
	
	search: string;

	ngOnInit() {

	}
}