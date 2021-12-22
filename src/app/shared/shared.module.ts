import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalComponent} from './components/modal/modal.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {SwiperComponent} from './components/swiper/swiper.component';
import {MaterialModule} from '../material/material.module';
import {SwiperModule} from 'swiper/angular';
import {TableResolucionComponent} from './components/table-resolucion/table-resolucion.component';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    ModalComponent,
    NavbarComponent,
    SwiperComponent,
    TableResolucionComponent
    

  ],
  imports: [
    CommonModule,
    MaterialModule,
    SwiperModule,
    FormsModule
  ],
  exports: [NavbarComponent, ModalComponent, SwiperComponent, TableResolucionComponent]
})
export class SharedModule {
}
