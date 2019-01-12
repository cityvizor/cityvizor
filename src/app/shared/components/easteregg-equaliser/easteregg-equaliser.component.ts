import { Component, Input, TemplateRef, ViewChild, NgZone, OnDestroy } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
	moduleId: module.id,
	selector: 'easteregg-equaliser',
  host: {'(window:keydown)': 'hotkeys($event)'},
	templateUrl: 'easteregg-equaliser.component.html',
	styleUrls: ['easteregg-equaliser.component.css']
})
export class EasterEggEqualiserComponent implements OnDestroy {
	
	// get the equaliser modal
	@ViewChild('equaliserTemplate')
	equaliserTemplate:TemplateRef<any>;
	
	modalRef: BsModalRef;
	  
  //AUDIO CONTEXT
	setup:{fftSize:number,
         minDecibels:number,
         maxDecibels:number,
         audioPath: string,
         delayOfFrames: number,
         bigBangHeight: number,
         maxLevelValue: number,
         showedLevels:number,
         skipFirstLevels: number} = {
             fftSize:64,
             minDecibels:-80,
             maxDecibels:-25,
             audioPath:'assets/audio/audio.mp3',
             delayOfFrames: 60,
             bigBangHeight: 800,
             maxLevelValue: 255,
             showedLevels:20,
             skipFirstLevels: 0};
	
	numbers: any;
	
	audioContext: AudioContext;
	bufferSource:any;
	loadingEqualiser: boolean = false;
	loadedAudio: boolean = false;
	playingAudio: boolean = false;
  audioBuffer: AudioBuffer;
	analyser: any;
	bufferLength: number;
	frequencyDataArray: Uint8Array = new Uint8Array(this.setup.fftSize);
  
  //KONAMI
  konami_def = [38,38,40,40,37,39,37,39,66,65]; // definition of keys to press
  konami_stack = [38,38,40,40,37,39,37,39,66,65]; // stack to shift elements when correct code pressed
  
	constructor(private zone: NgZone, private modalService: BsModalService) {
  }
	
	ngOnDestroy(){
		this.stopAudio();
	}

  loadEqualiser(){
		if (!this.loadingEqualiser) {
			
			console.log("Loading easter egg!");
			
      this.loadingEqualiser = true;

      this.audioContext = new AudioContext();

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = this.setup.fftSize;
      this.analyser.minDecibels = this.setup.minDecibels;
      this.analyser.maxDecibels = this.setup.maxDecibels;

      this.bufferLength = this.analyser.frequencyBinCount;

      this.frequencyDataArray = new Uint8Array(this.bufferLength);

      this.analyser.getByteFrequencyData(this.frequencyDataArray);
			
      this.fetchAudio()
        .then(audioBuffer => {
          this.audioBuffer = audioBuffer;

					this.bufferSource = this.audioContext.createBufferSource();
					this.bufferSource.buffer = this.audioBuffer;
					this.bufferSource.connect(this.analyser);
					this.analyser.connect(this.audioContext.destination);

					requestAnimationFrame(() => this.getAudioFrequencyData());

          this.loadedAudio = true;
				
          this.modalRef = this.modalService.show(this.equaliserTemplate);
				
        })
        .catch(error => { throw error; });
    }
  }
  
	fetchAudio(): Promise<any> {
    return fetch(this.setup.audioPath)
      .then(response => response.arrayBuffer())
      .then(buffer => {
        return new Promise((resolve, reject) => {
          this.audioContext.decodeAudioData(
            buffer,
            resolve,
            reject
          );
        })
      });
	}
  
	playAudio() {
		if(!this.playingAudio){
			this.bufferSource.start(0);
			this.playingAudio = true;
		}
	}
	
	stopAudio(){
		if(this.playingAudio){
			this.bufferSource.pause();
			
		}
	}
	
	getAudioFrequencyData() {
		if (this.playingAudio) {
    	this.analyser.getByteFrequencyData(this.frequencyDataArray);
      
			//WHY? -> https://teropa.info/blog/2016/12/12/graphics-in-angular-2.html#javascript-requestanimationframe
			requestAnimationFrame(() => this.getAudioFrequencyData());
		}
  }
  
  empty() {
    
  }
  
  /**
		* method to handle left/right arrows to switch the selected group
		*/
	hotkeys(event){
		var code = (typeof event.which == "number") ? event.which : event.keyCode;
		if(code !== this.konami_stack.shift()) this.konami_stack = this.konami_def.slice(0);
		if(this.konami_stack.length === 0){
			this.loadEqualiser();
			this.konami_stack = this.konami_def.slice(0);
		}
	}
	
	 
	// the dimensions of the drawing	
	r: number = 500;
 	cx: number = 0;
 	cy: number = 0;
	alpha: number = 1/8; // default rotation of the chart
	innerR: number = 0.2; // relative to radius
	minR: number = 0.22; // relative to radius
	 
	
	getStripeSize(i,levels){
		return Math.max(this.minR, Math.sqrt(levels[i] / this.setup.maxLevelValue * (1 - Math.pow(this.innerR,2)) + Math.pow(this.innerR,2)));
	}
	
	getCircleR() {
		return this.innerR * this.r * 0.9;
	}
	 
	// generate stripe by index, and inner and outer percentage size
	getStripePath(i,inner,outer){
		var innerRadius = inner * this.r;
		var outerRadius = outer * this.r;
		var size = 1 / this.setup.showedLevels;
		var start = i / this.setup.showedLevels;
		return this.getDonutPath(this.cx,this.cy,innerRadius,outerRadius,start,size);	
	}

	// generate SVG path attribute string for a donut stripe; start and size are percentage of whole
	getDonutPath(x,y,innerRadius,outerRadius,start,size){
		
		if(size >= 1) size = 0.9999; // if a stripe would be 100%, then it's circle, this is a hack to do it using this function instead of another
		
		innerRadius = Math.max(innerRadius,0); // inner size must be greater than 0
		outerRadius = Math.max(outerRadius,innerRadius); // outer size must be greater than inner
		size = Math.max(size,0); // size must be greater than 0
		//if(size == 0 || size == 1) start = 0; // if a stripe is 0% or 100%, means it has to start at 0 angle 
		
		// the following fomulas come from analytic geometry and SVG path specification
		var startAngle = 2 * Math.PI * start;
		var angle =  2 * Math.PI * size;

		var startX1 = x + Math.sin(startAngle) * outerRadius;
		var startY1 = y - Math.cos(startAngle) * outerRadius;
		var endX1 = x + Math.sin(startAngle + angle) * outerRadius;
		var endY1 = y - Math.cos(startAngle + angle) * outerRadius;

		var startX2 = x + Math.sin(startAngle + angle) * innerRadius;
		var startY2 = y - Math.cos(startAngle + angle) * innerRadius;
		var endX2 = x + Math.sin(startAngle) * innerRadius;
		var endY2 = y - Math.cos(startAngle) * innerRadius;

		var outerArc = (size > 0.5 ? 1 : 0); // decides which way will the arc go

		var properties = [];
		properties.push("M" + startX1 + "," + startY1);
		properties.push("A" + outerRadius + "," + outerRadius + " 0 " + outerArc + ",1 " + endX1 + "," + endY1);
		properties.push("L" + startX2 + "," + startY2);
		properties.push("A" + innerRadius + "," + innerRadius + " 0 " + outerArc + ",0 " + endX2 + "," + endY2);
		properties.push("Z");

		return properties.join(" ");
	}
	 
  
}