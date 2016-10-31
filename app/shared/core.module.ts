import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import { DataService } 		from '../services/data.service';


@NgModule({
  imports:      [ CommonModule ],
  declarations: [  ],
  exports:      [  ],
  providers:    [ DataService ]
})
export class CoreModule { }