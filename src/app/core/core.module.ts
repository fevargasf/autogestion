import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { DomSeguroPipe } from './pipes/dom-seguro.pipe';


@NgModule({
  declarations: [
    DomSeguroPipe
  ],
  exports: [
    DomSeguroPipe
  ],
  imports: [
    CommonModule,
  ]
})
export class CoreModule {
}
