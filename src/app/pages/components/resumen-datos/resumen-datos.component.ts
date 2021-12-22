import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import Swal from 'sweetalert2';
import {MatStepper} from '@angular/material/stepper';
import {ListaExpedienteArr} from 'src/app/pages/components/interfaces/lista_expediente-arr.interface';
import {ExpedienteService} from 'src/app/core/services/expediente.service';
import {ActivatedRoute} from '@angular/router';
import {Resolucion} from 'src/app/pages/components/interfaces/resolucion.interface';
import {MatDialog} from '@angular/material/dialog';
import {ListaExpedientes} from 'src/app/pages/components/interfaces/lista_expedientes.interface';
import { DomSanitizer } from '@angular/platform-browser';
import {pdfDefaultOptions,LinkTarget,PageRenderedEvent} from 'ngx-extended-pdf-viewer';
import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'app-resumen-datos',
  templateUrl: './resumen-datos.component.html',
  styleUrls: ['./resumen-datos.component.scss'],

  
})
export class ResumenDatosComponent implements OnInit {
  @Output() atrasSegundoOut = new EventEmitter<boolean>();
  @Output() actualiza = new EventEmitter<boolean>();
  @Output() atrasTerceroComp = new EventEmitter<boolean>();
  @Output() siguienteTerceroComp = new EventEmitter<any>();

  @Input() events: Observable<any>;
  private eventsSubscription:Subscription;


  public listaExpedientes: ListaExpedienteArr[];
  public resoluciones: Resolucion[];
  public listaExpediente: ListaExpedienteArr;
  public tipoPersona: string;
  public dataObligacion: any[];
  public dataArchivo: any[] = [];
  public unionData: any[] = [];
  public radicado: string;
  public downloaded: string | undefined;
  public pdfUrl;
  public ter_email: string;
  public ter_direccion: string;
  public isLoading = false;
  public pdfHandler;
  fileUrl;
  constructor(
    private stepper: MatStepper,
    private expediente: ExpedienteService,
    private activeRoute: ActivatedRoute,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';

   
  }

  ngOnInit(): void {
    this.getDataLocalStore();
    this.tipoPersonas();
    this.dataObligaciones();
    //this.getDataArchivoLocalStorage();
    this.listaExpedientesComp();
    //this.obligacionyarchivos();
    this.expediente.radicadoObservable$.subscribe((data) => {
      this.radicado = data;
    });
  

    //this.generarPdf();
    this.eventsSubscription = this.events.subscribe(state=>{
      if(state){
        this.generarPdf();
      
      }else{
        this.pdfUrl = "";
      }
    });
  }


  public atrasSegundo(): void {
    this.atrasSegundoOut.emit(true);
  }
  public siguienteTercero(): void {
    //this.siguienteTerceroComp.emit(true);
    Swal.fire({
      title: 'Se radicara la información suministrada en el proceso y no tendra retorno.¿ Esta Seguro que desea radicar?',
      icon: 'question',
      confirmButtonText: 'Aceptar',
      denyButtonText: 'Cancelar',
      showConfirmButton: true,
      showCancelButton: true,
    }).then((value) => {
       if (value.isConfirmed) {
        //this.stepper.next();
        this.radicar();
        let timerInterval

        Swal.fire({
          title: '!Estamos trabajando para tí!',
          html: 'Se esta generando el PDF Radicado, <strong></strong>un momento.',
          timer: 30000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector('strong')
            timerInterval = setInterval(() => {
              b.textContent = Swal.getTimerLeft().toString()
            }, 20000)
          },
          willClose: () => {
            clearInterval(timerInterval)
          }
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log('cerrado')
          }
        })
      } else {
      } 
    });
  
  }

  public radicar(){    
    
    const expediente = JSON.parse(localStorage.getItem('expediente'));
    const sec = JSON.parse(localStorage.getItem('sec'));
    const expedienteActual = JSON.parse(sessionStorage.getItem('expedienteActual'));
    const dataRadicado = {
      // tslint:disable-next-line:radix
      sequenceThirdParty2: +expedienteActual.exp_sec ,
      // tslint:disable-next-line:radix
      sequenceThirdParty: parseInt(sec.sequenceThirdParty)
    };

    this.expediente.obtenerRadicado(dataRadicado).subscribe((result) => {
      this.expediente.radicadoData(result.voRadicadoCoe);
      if (
        result.voRadicadoCoe === null ||
        result.doRadicado === null ||
        result.noSecDocCoe === null ||
        result.voRutaCoe === null ||
        result.voRadicadoCoe === "null" ||
        result.doRadicado === "null" ||
        result.noSecDocCoe === "null" ||
        result.voRutaCoe === "null" 
      ) {
        Swal.fire(`${result.voError}`, '', 'error');

      } else {
        let radicado = {radicado: result.voRadicadoCoe, ruta: result.voRutaCoe, fechaRadicado:result.doRadicado};
        this.siguienteTerceroComp.emit(radicado);
      }
    });
  }


  public aceptarModal(): void {
    this.stepper.next();
    this.dialog.closeAll();
  }

  public getDataLocalStore(): void {
    const sec = JSON.parse(localStorage.getItem('sec'));
    const expediente = JSON.parse(localStorage.getItem('expediente'));
    const expedienteActual = JSON.parse(sessionStorage.getItem('expedienteActual'));
    // tslint:disable-next-line:radix
    const exp = expedienteActual.exp_sec;
    this.expediente.getListaExpedientes(sec.sequenceThirdParty).subscribe((data:ListaExpedientes) => {
      if (data.result) {
        data.lista_expedientes.filter((item) => {
          if (item.expediente === expedienteActual.exp_sec) {
           this.listaExpediente = item;
          }
        });
      }
    });
  }

  private tipoPersonas(): void {
    this.activeRoute.params.subscribe((params) => {
      this.tipoPersona = params.tipoPersona;
    });
  }

  private dataObligaciones(): void {
    this.expediente.dataObligacionObservable$.subscribe((data) => {
      this.dataObligacion = data;
    });
  }

  public generarPdf(): void {
    this.actualiza.emit(true);
    const sec = JSON.parse(localStorage.getItem('sec'));
    const expediente = JSON.parse(localStorage.getItem('expediente'));
    const expedienteActual = JSON.parse(sessionStorage.getItem('expedienteActual'));
    this.pdfUrl =`http://localhost:5000/api/self-management/listar-archivos/consulta-archivos?sequenceThirdParty2=${expediente.sequenceThirdParty2}&sequenceThirdParty=${sec.sequenceThirdParty}`;
    this.isLoading=true;
    
    let data = {
      sequenceThirdParty : sec.sequenceThirdParty,
      sequenceThirdParty2 :expedienteActual.exp_sec
    }
    this.pdfUrl =  this.expediente.consultaArchivoURL(data);
    /* this.expediente.consultaBlob(data).subscribe(
      result=>{
        debugger
      let file = new Blob([result],{type:"application/pdf"});
      let blobUrl = URL.createObjectURL(file);

      this.pdfUrl = blobUrl;
     } 
    ); */

   /*  `https://pruebas.corantioquia.gov.co/autogestion/listar-archivos/consulta-archivos?sequenceThirdParty2=${expediente.sequenceThirdParty2}&sequenceThirdParty=${sec.sequenceThirdParty}`; */
  }

 

  public pageInitialized(e: CustomEvent) {
  }
  public listaExpedientesComp(): void {
    const expediente = JSON.parse(localStorage.getItem('expediente'));
    const expedienteActual = JSON.parse(sessionStorage.getItem('expedienteActual'));
    const secuencia = {
      sequenceThirdParty2: +expedienteActual.exp_sec,
    };
    console.log(secuencia.sequenceThirdParty2)
    this.expediente.postObtenerResolucion(expedienteActual.exp_sec).subscribe((result) => {
      if (result.result) {
        this.resoluciones = result.resoluciones;
      }
    });
  }

 
 
}
