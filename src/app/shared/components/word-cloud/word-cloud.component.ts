import { Component, ViewChild, OnInit, ElementRef, Input } from '@angular/core';
import { ReplaySubject } from 'rxjs';

import * as WordCloud from "wordcloud";

type Word = [string,number];

@Component({
  selector: 'word-cloud',
  templateUrl: './word-cloud.component.html',
  styleUrls: ['./word-cloud.component.scss']
})
export class WordCloudComponent {

  @ViewChild("wordcloud") wordcloudEl: ElementRef<HTMLElement>;

  @Input() minSize = 10;
  @Input() maxSize = 70;
  @Input() minOpacity = 0.2;
  @Input() maxOpacity = 1;

  words:ReplaySubject<Word[]> = new ReplaySubject(1);

  @Input("words") set setWords(words:Word[]){
    this.words.next(words);
  }

  constructor() { }

  ngAfterViewInit(){
    this.words.subscribe(words => this.createWordcloud(words));
  }
    
  createWordcloud(words:Word[]) {    
    console.log("create",words);

    if(!words) return;

    const max = words.reduce((acc, cur) => Math.max(cur[1], acc), 0);

    const replaced = ["spol\\. s r\\.o\\.", "a\\. ?s\\.", "s\\.? ?r\\. ?o\\.", "JUDR\\.", "příspěvková organizace", ","].map(string => new RegExp(string, "i"));

    words.forEach(word => word[1] = word[1] / max);

    const options:WordCloud.Options = {
      list: words,
      weightFactor: size => (1 - size) * this.minSize + size * this.maxSize,
      rotateRatio: 0,
      color: (word, weight, fontSize, distance, theta) => `rgba(37, 129, 196, ${(1 - (fontSize - this.minSize) / (this.maxSize - this.minSize)) * this.minOpacity + ((fontSize - this.minSize) / (this.maxSize - this.minSize)) * this.maxOpacity})`,
      classes: "word",
      click: (item, dimension, event) => console.log(item,dimension)
    };

    WordCloud(this.wordcloudEl.nativeElement, options);
  }

}
