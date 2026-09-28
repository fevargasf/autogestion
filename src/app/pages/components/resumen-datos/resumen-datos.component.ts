import {AfterViewChecked, AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import Swal from 'sweetalert2';
import {ListaExpedienteArr} from 'src/app/pages/components/interfaces/lista_expediente-arr.interface';
import {ExpedienteService} from 'src/app/core/services/expediente.service';
import {ActivatedRoute} from '@angular/router';
import {Resolucion} from 'src/app/pages/components/interfaces/resolucion.interface';
import {MatDialog} from '@angular/material/dialog';
import {ListaExpedientes} from 'src/app/pages/components/interfaces/lista_expedientes.interface';
import {pdfDefaultOptions} from 'ngx-extended-pdf-viewer';
import { Observable, Subscription, Subject } from 'rxjs';
import { HttpClient} from "@angular/common/http";
import {filter,takeUntil} from 'rxjs/operators';
import { SignatureComponent } from 'src/app/shared/components/Signature/Signature.component';


@Component({
  selector: 'app-resumen-datos',
  templateUrl: './resumen-datos.component.html',
  styleUrls: ['./resumen-datos.component.scss'],


})
export class ResumenDatosComponent implements OnInit, OnDestroy{
 @ViewChild('modal') modal!: SignatureComponent;
  private destroy$ = new Subject<void>();
  @Output() atrasSegundoOut = new EventEmitter<boolean>();
  @Output() actualiza = new EventEmitter<boolean>();
  @Output() atrasTerceroComp = new EventEmitter<boolean>();
  @Output() siguienteTerceroComp = new EventEmitter<any>();
  @Input() events: Observable<any>;
  @Output() onNextStep: EventEmitter<void> = new EventEmitter<void>();
  suscription:Subscription;
  radication:Subscription;
  fileInfos?: Observable<any>;
  firmaSubscription: Subscription;
  public state = false;
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
  public TopdfUrl = false;
  public pdfGeneratedSuccessfully: boolean = false;
  public fileUrl;
  public pdfSrc;
  public currentStep:number = 1;
  public habilita: string;
  public habilitaRadik:boolean=true;
  public responsable: any;

  constructor(
    private expediente: ExpedienteService,
    private activeRoute: ActivatedRoute
  ) {
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';
  }

  ngOnInit(): void {
    //this.habilitaRadik = true;
    this.habilita = localStorage.getItem('firma');
    this.getDataLocalStore();
    this.tipoPersonas();
    this.listaExpedientesComp();
    this.fileInfos = this.expediente.getFiles();
    this.fileInfos.pipe(
      filter(fileInfos => fileInfos && fileInfos.length > 0)

    ).subscribe(
      (result) => {
        this.TopdfUrl = true;
        this.generarPdf();

    });
     this.expediente.refresh$
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.generarPdf();
    });

     this.expediente.radicadoObservable$.subscribe((data) => {
      this.radicado = data;
    });

    this.firmaSubscription = this.expediente.firma$.subscribe(
      (f) => {

        if(f){
          this.habilita = localStorage.getItem('firma');
          if(this.habilita === 'true'){
            this.habilitaRadik = true;

          }else{
           this.habilitaRadik = false;
          }
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.firmaSubscription.unsubscribe();
  }

  public atrasSegundo(): void {
    this.atrasSegundoOut.emit(true);
  }
  public siguienteTercero(): void {
    //this.siguienteTerceroComp.emit(true);
    Swal.fire({
      title: 'Con esta acción se genera un radicado y se termina el proceso de autogestión. ¿Está seguro(a) de continuar?',
      icon: 'question',
      confirmButtonText: 'Aceptar',
      denyButtonText: 'Cancelar',
      showConfirmButton: true,
      showCancelButton: true,
    }).then((value) => {
       if (value.isConfirmed) {

        this.radicar();
    /*  */
      } else {
        this.habilitaRadik = true;
      }
    });
  }
  public radicar(){

    if (!this.pdfGeneratedSuccessfully) {
      this.habilitaRadik = true;
      // Si el PDF no se generó correctamente, evitamos la radicación.
      Swal.fire('El PDF no se ha generado correctamente', '', 'warning');
      return;
    }
    const sec = JSON.parse(localStorage.getItem('sec'));
    const expedienteActual = JSON.parse(this.expediente.getData('expedienteActual'));

    let secExpediente =  JSON.parse(localStorage.getItem('expediente'));
    const dataRadicado = {
      // tslint:disable-next-line:radix
      sequenceThirdParty2: +secExpediente.sequenceThirdParty2 ,
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
        result.voFechaRadicado === "null" ||
        result.noSecDocCoe === "null" ||
        result.voRutaCoe === "null"
      ) {
        Swal.fire('No fue posible radicar el documento.', "No se encontró una gestión en elaboración para el expediente.", 'error');

      } else {
        let radicado = { radicado: result.voRadicadoCoe, ruta: result.voRutaCoe, fechaRadicado:result.voFechaRadicado };
       // localStorage.setItem('coe', JSON.stringify(radicado));
       if(result.voError === "null" ){
        this.onNextStep.emit();
        this.expediente.recopRad(radicado);
       }

      }
    });
  }
   // Avanzar al siguiente paso
   nextStep() {
    this.currentStep++;
  }
  openModal() {
    this.modal.openModal();
  }
  public getDataLocalStore(): void {
    const sec = JSON.parse(localStorage.getItem('sec'));
    const expedienteActual = JSON.parse(this.expediente.getData('expedienteActual'));

    this.expediente.getListaExpedientes(sec.sequenceThirdParty).subscribe((data:ListaExpedientes) => {
      if (data.result) {
        data.lista_expedientes.find((item) => {
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

 async generarPdf() {

    const expediente = JSON.parse(localStorage.getItem('expediente'));
    const expedienteActual = JSON.parse(this.expediente.getData('expedienteActual'));
    const sec = JSON.parse(localStorage.getItem('sec'));
    this.responsable = JSON.parse(this.expediente.getData('responsable'));

    const RES = JSON.parse(this.expediente.getData('RES'));
    const colum = JSON.parse(localStorage.getItem('colum'));
    const totalResolucion = JSON.parse( this.expediente.getData('arrayR'));
    const coordenadasTotal = JSON.parse(sessionStorage.getItem('coordenadasTotal'));
    const naturaleza =  localStorage.getItem('isTipoPersona');
    const vistaPreviaPDF = {
      expedientDTO: {
        respon_nombre: this.responsable.nombre,
        respon_correo: this.responsable.correo,
        respon_cargo: this.responsable.cargo,
        respon_telefono_celu: this.responsable.telefonoCelular,
        ter_dir_municipio: expedienteActual.ter_dir_municipio,
        ter_nombres: expedienteActual.ter_nombres,
        ter_email: expedienteActual.ter_email,
        ter_celular: expedienteActual.ter_telefono,
        expediente: expedienteActual.expediente,
        ter_naturaleza:naturaleza,
        radicado: RES.radicado,
        fecha_firmeza: expedienteActual.fecha_firmeza,
        coe_RADICADO:  'vista previa',
        nombre_asunto: expedienteActual.nombre_asunto,
        coordenada_x: RES.coordenada_x,
        coordenada_y: RES.coordenada_y,
        sistema_coordenadas: RES.sistema_coordenadas,
        descriptor: RES.descriptor,
        colum: colum,
        arrayR: totalResolucion,
        coordenadas: coordenadasTotal,
      },
      radicado: 'vista previa',
      fechaRadicado: 'vista previa',
      ruta: '',
      sequenceThirdParty: parseInt(sec.sequenceThirdParty),
      sequenceThirdParty2: parseInt(expediente.sequenceThirdParty2),
    };

    await this.expediente
    .consultaArchivoURL(vistaPreviaPDF).subscribe(
     (result) => {
     if(result){
      let file = new Blob([result], { type: 'application/pdf' });
      let blobUrl = URL.createObjectURL(file);
      this.pdfSrc = blobUrl;
      this.pdfGeneratedSuccessfully = true;
     }

     },
     (error) => {
      Swal.fire('Error en la previsualización', '','error');
      this.pdfGeneratedSuccessfully = false;
     }
   );
  };

  public pageInitialized(e: CustomEvent) {

  }

  public listaExpedientesComp(): void {

    let resolucionExpe = JSON.parse(localStorage.getItem('expediente'));
    this.expediente.postObtenerResolucion(resolucionExpe.sequenceThirdParty2).subscribe((result) => {
      if (result.result) {
        this.resoluciones = result.resoluciones;
      }
    });
  }

}
