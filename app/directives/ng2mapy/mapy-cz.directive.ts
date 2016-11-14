import { Directive, ElementRef, Input, Renderer } from '@angular/core';

import * from 'https://api.mapy.cz/loader.js';

@Directive({ selector: 'mapy-cz' })
export class ng2MapyCZ {
    constructor(el: ElementRef, renderer: Renderer) {
       
    }
}