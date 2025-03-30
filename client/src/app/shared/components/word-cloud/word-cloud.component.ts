import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from "@angular/core";
import { ReplaySubject } from "rxjs";

import * as WordCloud from "wordcloud";

export type Word = [string, number];

@Component({
  selector: "word-cloud",
  templateUrl: "./word-cloud.component.html",
  styleUrls: ["./word-cloud.component.scss"],
})
export class WordCloudComponent implements AfterViewInit {
  @ViewChild("wordcloud", { static: false })
  wordcloudEl: ElementRef<HTMLElement>;

  @Input() minSize: number = 10;
  @Input() maxSize: number = 70;
  @Input() minOpacity: number = 0.2;
  @Input() maxOpacity: number = 1;

  @Output() click: EventEmitter<Word> = new EventEmitter<Word>();

  @Input("words")
  set setWords(words: Word[]) {
    this.words.next(words);
  }

  words: ReplaySubject<Word[]> = new ReplaySubject(1);

  constructor() {}

  ngAfterViewInit() {
    this.words.subscribe(words => this.createWordcloud(words));
  }

  createWordcloud(words: Word[]) {
    // if words is null or undefined, do nothing. Note: empty array will pass as expected
    if (!words) return;

    const max = words.reduce((acc, cur) => Math.max(cur[1], acc), 0);

    words.forEach(word => (word[1] = word[1] / max));

    const options: WordCloud.Options = {
      list: words,
      weightFactor: size => (1 - size) * this.minSize + size * this.maxSize,
      rotateRatio: 0,
      color: (word, weight, fontSize, distance, theta) =>
        `rgba(37, 129, 196, ${(1 - (fontSize - this.minSize) / (this.maxSize - this.minSize)) * this.minOpacity + ((fontSize - this.minSize) / (this.maxSize - this.minSize)) * this.maxOpacity})`,
      classes: "word",
      click: (item, dimension, event) => this.click.emit(item),
    };

    WordCloud(this.wordcloudEl.nativeElement, options);
  }
}
