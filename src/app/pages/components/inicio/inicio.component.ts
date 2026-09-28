import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import { Resolucion } from 'src/app/pages/components/interfaces/resolucion.interface';
import {Obligaciones} from "src/app/pages/components/interfaces/obligaciones.interface";
import { Archivos } from 'src/app/pages/components/interfaces/archivos';
import { ExpedienteService } from 'src/app/core/services/expediente.service';
import { ListaExpedientes } from 'src/app/pages/components/interfaces/lista_expedientes.interface';
import { Subject } from 'rxjs';
import { InstructivoComponent } from 'src/app/shared/components/instructivo/instructivo.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  @ViewChild('modal') modal!: InstructivoComponent;
  public currentStep:number = 1;
  public eventSubject: Subject<any> = new Subject<any>();
  public expediente: any;
  public resoluciones: Resolucion[] = [];
  public obligaciones: Obligaciones[];
  public nombreArchivo: string ;
  public nombreObligacion: string ;
  public ocultarObligacion = true;
  public valueArchivo: string;
  public isLinear = false;
  public isEditableInicio = false;
  public completoInicio = false;
  public isEditable1 = false;
  public completo1 = false;
  public formulario1: FormGroup;
  public isEditable2 = false;
  public completo2 = false;
  public completo3 = false;
  public isEditable3 = false;
  public tipoPersona: string;
  public cantidadObligaciones = [];
  public mostrarContenido = false;
  public radicado:string;
  public archivos: Archivos[] = [];
  public resolucion:Resolucion;
  public isLoading3 = true;
  public isLoading = true;
  public isLoading2 = true;
  public archivosArr: any[] = [];
  public dataObligacion: object;
  public dataObligaciones: any[] = [];
  public documentosArr: any[] = [];
  public dataDelArchivo: any;
  public visualizarBtn = false;
  public formulario: FormGroup;
  public nombre:string;
  public vistaPre:boolean;
  readonly BASE_URL = environment.urls;
  constructor(
    private expedienteService: ExpedienteService,
    private activeRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.resoluciones = [];
    this.obligaciones = [];
    this.archivos = [];
  }

  ngOnInit(): void {
    this.dataParams();
    this.getDataLocalStorage();
    //this.dataBuilder();
  }

  lengthObliga(estado: boolean) {
    this.vistaPre = estado
    }
    openModal() {
      this.modal.openModal();
    }

  public cerrarSession(): void {
  let valida = this.expedienteService.redireccionesValidas(this.BASE_URL);

   if(valida){
    window.location.href = this.BASE_URL;
    this.delCookiePath();
   }
   document.cookie = 'coraconn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';

    localStorage.removeItem('sec');
    localStorage.removeItem('radicadoR');
    localStorage.removeItem('responsable');
    localStorage.removeItem('expediente');
    localStorage.removeItem('expedienteActual');
    sessionStorage.removeItem('exA');
    sessionStorage.removeItem('expedientes.ts');
    localStorage.removeItem('arrayR');
    window.sessionStorage.removeItem("expedienteActual");
    window.sessionStorage.removeItem("sec");
    window.localStorage.removeItem("responsable");
    window.localStorage.removeItem("expediente");
    window.localStorage.removeItem("RES");
    window.localStorage.removeItem("colum");
    window.localStorage.removeItem("dataResponse");
    let myCookie = 'coraconn'
    this.deleteCookie(myCookie);
  }

  private deleteCookie(cookieName) {
    this.expedienteService.delCookie().subscribe({
      next: (res) => {
        document.cookie = 'coraconn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';

        localStorage.clear();

      }
    })
       // Obtener la cookie actual
    if (document.cookie.includes(cookieName)) {
      // Eliminar la cookie con path y dominio si es necesario
      document.cookie = `${cookieName}=; Max-Age=0; path=/; domain=` + location.host;
      document.cookie = `${cookieName}=; Max-Age=0; path=/; domain=` + location.hostname;
      document.cookie = 'coraconn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
    }
    }

    public delCookiePath(){

      this.expedienteService.delCookie().subscribe({
        next: (res) => {
          document.cookie = 'coraconn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
          localStorage.clear();

        }
      })
    }

  public dataParams(): void {
    this.activeRoute.params.subscribe(params => {
      this.tipoPersona = params.tipoPersona;
      this.expediente = params.expediente;


    });
  }


/*   public generarPdf():void{

  } */
/*
  public addObligacion(): FormGroup {
    return this.fb.group({
      nombre_obligacion: ['', Validators.required],
      documentos: [[], Validators.required],
      observaciones: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  } */
  public getDataLocalStorage(): void{
    const sequenceThirdParty = JSON.parse(localStorage.getItem('sec')).sequenceThirdParty;
     this.expedienteService.getListaExpedientes(sequenceThirdParty ).subscribe((datas: ListaExpedientes) => {
      if (datas.result){
        datas.lista_expedientes.find((value) => {
          if (value.exp_sec ===  this.expediente){
            const newResolucion = {
              sequenceThirdParty2: value.expediente.toString()
            };
            localStorage.setItem('expediente', JSON.stringify(newResolucion));

            this.expediente = newResolucion.sequenceThirdParty2;
            this.expedienteService.postObtenerResolucion(newResolucion.sequenceThirdParty2).subscribe((dataRe) => {
                if (dataRe.result){
                  this.resoluciones = dataRe.consulta_resolucion;
                  this.expedienteService.getConsultarObligacion$( sequenceThirdParty);

                }
            });
          }
        });
      }
    });
    // this.postExpediente(data.id);
  }

  seleccionResolucion(resolucion){
    this.resolucion = resolucion;

    this.completoInicio = true;
    this.isEditableInicio = false;

    this.isEditable1 = true;
    //this.stepper.next();
    this.nextStep();
  }

  seleccionObligacion(obligaciones){
    this.obligaciones = obligaciones;

    this.nextStep();
  }

  public siguientePrimero(estado: any): void {
    this.completo1 = estado;
    this.isEditable1 = !estado;
    // this.stepper.next();

    this.isEditable2 = true;
   // this.eventSubject.next(true);
  }
   // Avanzar al siguiente paso
   nextStep() {
    this.currentStep++;
  }

  // Retroceder al paso anterior
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Comprobar si el paso actual es el activo
  isActiveStep(step: number): boolean {
    return this.currentStep === step;
  }

  // Comprobar si el paso está completado
  isCompletedStep(step: number): boolean {
    return this.currentStep === step;
  }


  public siguienteSegundo(radicado:any): void {
    this.radicado = radicado;
  //  console.log( this.radicado)
    let estado = radicado?true:false;
  }

  public siguienteConfirmacion(estado: any): void {
    this.completo2 = estado;
    this.isEditable2 = !estado;
  }

  public atrasPrimero(estado: any): void {
    this.isEditable1 = false;

    this.isEditableInicio = true;
    this.completoInicio = false;

/*     setTimeout(() => {
    //  this.stepper.previous();

    this.eventSubject.next(false);
    },10);

    this.eventSubject.next(false); */
  }

  public atrasSegundo(estado: any): void {
    this.isEditable2 = false;

    this.isEditable1 = true;
    this.completo1 = false;

/*     setTimeout(() => {
    //  this.stepper.previous();
    this.eventSubject.next(false);
    },10); */
  }

  public atrasTercero(estado: any): void {
    // this.completo1 = !estado;
    this.isEditable3 = estado;
  }


}
