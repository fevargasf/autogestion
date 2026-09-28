import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalComponent} from './components/modal/modal.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {MaterialModule} from '../material/material.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {TableResolucionComponent} from './components/table-resolucion/table-resolucion.component';
import {FormsModule} from '@angular/forms';
import { PipeOrderPipe } from './components/pipe-order.pipe';
import { SpinnerModule } from "./spinner/spinner.module";
import { InstructivoComponent } from './components/instructivo/instructivo.component';


@NgModule({
  declarations: [
    ModalComponent,
    NavbarComponent,
    TableResolucionComponent,
    PipeOrderPipe,
    InstructivoComponent


  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    SpinnerModule
],
  exports: [NavbarComponent, ModalComponent, TableResolucionComponent,InstructivoComponent
  ]
})
export class SharedModule {
}
