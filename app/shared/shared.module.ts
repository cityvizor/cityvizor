import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';

import { HttpModule } from '@angular/http';

import { MoneyPipe }         from '../pipes/money.pipe';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ MoneyPipe ],
  exports:      [ MoneyPipe, CommonModule, HttpModule ]
})
export class SharedModule { }