import { Component, OnInit} from '@angular/core';

import { AppConfig } from '../../config/app-config';

@Component({
	moduleId: module.id,
  selector: 'front-page',
	templateUrl: 'front-page.template.html',
	styles: [`
#frontImage{padding:20px;}
.box{background-color:rgba(255,255,255,.7);border-radius:5px;font-size:.8em;}
.box.padding{padding:20px;}
::-webkit-input-placeholder {
  color: rgba(0,0,0,0.25);
}
:-moz-placeholder { /* Firefox 18- */
  color: rgba(0,0,0,0.25);
}
::-moz-placeholder {  /* Firefox 19+ */
  color: rgba(0,0,0,0.25);
}
:-ms-input-placeholder {  
  color: rgba(0,0,0,0.25);
}
textarea:focus, input:focus{
  outline: none;
}

#headerVyberObce {
  display: block;  padding: 50px 0px 20px 0px;
  background: url('/assets/img/polepozadi5.jpg') no-repeat; 
  background-size: cover; background-position: center -10px; 
  text-align: center;
  border-bottom: 10px solid #2581c4;
  max-height: 300px;
}
@media (max-width: 1200px) {
  #headerVyberObce {
    background-size: 1200px auto; /* Force the image to its minimum width */
  }
}
#headerVyberObce svg {
  min-width: 300px;
  width: 67%;
  max-width: 750px;

}

section#ask {
  background: #f4faff;
  color: #2581c4;
  border-bottom: 0px solid #ADF;
}
section#ask p.lead {
    font-weight: 500;
}
section#ask .btn {
  border: none;
  color: white;
  background: #e73431;
  font-weight: bold;
}

section#features p.text-muted {
  color: #2581c4;
}
`]
})
export class FrontPageComponent implements OnInit {
	
	search: string;
	
	config:any = AppConfig;

	ngOnInit() {

	}
}