import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomeRoutingModule} from './home-routing.module';
import {HomeComponent} from './components/home/home.component';
import {SharedModule} from '../shared/shared.module';
import {PagesModule} from '../pages/pages.module';
import { SpinnerModule } from "../shared/spinner/spinner.module";
import { InstructivoComponent } from '../shared/components/instructivo/instructivo.component';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    PagesModule,
    SpinnerModule
]
})
export class HomeModule {
}
