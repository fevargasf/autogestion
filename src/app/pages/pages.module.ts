import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PagesRoutingModule} from './pages-routing.module';
import {AdjuntarComponent} from './components/adjuntar/adjuntar.component';
import {AutogestionRealizadasComponent} from './components/autogestion-realizadas/autogestion-realizadas.component';
import {ConfirmacionEnvioComponent} from './components/confirmacion-envio/confirmacion-envio.component';
import {ExpedienteProcesoComponent} from './components/expediente-proceso/expediente-proceso.component';
import {ExpedientesComponent} from './components/expedientes/expedientes.component';
import {InicioComponent} from './components/inicio/inicio.component';
import {NuevoExpedienteComponent} from './components/nuevo-expediente/nuevo-expediente.component';
import {ResumenDatosComponent} from './components/resumen-datos/resumen-datos.component';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {MaterialModule} from '../material/material.module';
import {DatosJuridicosComponent} from './components/datos-juridicos/datos-juridicos.component';
import {DatosNaturalComponent} from './components/datos-natural/datos-natural.component';
import {PdfMakeWrapper} from 'pdfmake-wrapper';
import {NgbModule, NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { SelectResolucionComponent } from './components/select-resolucion/select-resolucion.component';
import {DocumentRadicadoComponent} from './components/document/document-radicado.component'
import { CoreModule } from '../core/core.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatNativeDateModule } from '@angular/material/core';
//import {TableArchivosComponent} from '../shared/components/table-archivos/table-archivos.component';
import {TableObligacionesComponent} from '../shared/components/table-obligaciones/table-obligaciones.component';
//import { ListasTablasComponent } from './components/listas-tablas/listas-tablas.component';
import { OutputPdfComponent } from './components/container/output-pdf/output-pdf.component';
import { HeaderComponent } from './components/header/header.component';
import { OutputDocumentComponent } from './components/containerDocument/output-document/output-document.component';
import { HeaderDocumentComponent } from './components/headerDoc/header-document/header-document.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SpinnerModule } from '../shared/spinner/spinner.module';
import { HTTP_INTERCEPTORS} from '@angular/common/http';
import { SpinnerInterceptor } from '../shared/spinner.interceptor';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { InstructivoComponent } from '../shared/components/instructivo/instructivo.component';
import { SignatureComponent } from '../shared/components/Signature/Signature.component';
PdfMakeWrapper.setFonts(pdfFonts);

@NgModule({
  declarations: [
    AdjuntarComponent,
    AutogestionRealizadasComponent,
    ConfirmacionEnvioComponent,
    ExpedienteProcesoComponent,
    ExpedientesComponent,
    InicioComponent,
    NuevoExpedienteComponent,
    ResumenDatosComponent,
    DatosJuridicosComponent,
    DatosNaturalComponent,
    SelectResolucionComponent,
    DocumentRadicadoComponent,
    SignatureComponent,
    TableObligacionesComponent,
    //TableArchivosComponent,
    //ListasTablasComponent,
    HeaderComponent,
    OutputPdfComponent,
    OutputDocumentComponent,
    HeaderDocumentComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    PdfViewerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    SharedModule,
    MaterialModule,
    NgbPaginationModule,
    NgbModule,
    CoreModule,
    MatProgressBarModule,
    FlexLayoutModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    SpinnerModule

  ],
  providers: [
     {provide:HTTP_INTERCEPTORS, useClass:SpinnerInterceptor, multi: true}

  ]
})
export class PagesModule {
}
