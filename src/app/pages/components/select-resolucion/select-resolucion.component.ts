import { Component, ElementRef, EventEmitter, OnInit, Output, Input, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
//import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { ExpedienteService } from 'src/app/core/services/expediente.service';
import { allowK } from 'src/app/core/services/storageVariables';
import { Archivos } from 'src/app/pages/components/interfaces/archivos';
import { ListaExpedientes } from 'src/app/pages/components/interfaces/lista_expedientes.interface';
import { Obligaciones } from 'src/app/pages/components/interfaces/obligaciones.interface';
import { Resolucion } from 'src/app/pages/components/interfaces/resolucion.interface';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import { HttpErrorResponse } from '@angular/common/http';
import { of, Subscription } from 'rxjs';
import { catchError, distinctUntilChanged, switchMap, take, tap } from 'rxjs/operators';
@Component({
  selector: 'app-select-resolucion',
  templateUrl: './select-resolucion.component.html',
  styleUrls: ['./select-resolucion.component.scss']
})
export class SelectResolucionComponent implements OnInit, OnDestroy {
  @ViewChild('inputFile') inputFile: ElementRef;
  @Output() seleccionResolucion = new EventEmitter<any>();
  @Output() siguientePrimeroOut = new EventEmitter<any>();
  @Input() expedienteInput:  ListaExpedientes;
  public sinResolucion:boolean = false;
  currentUserSubscription: Subscription;
  banderaSubscription: Subscription;
  public nombreArchivo: string;
  public nombreObligacion: string;
  public ocultarObligacion = true;
  public valueArchivo: string;
  public cambioNombre:  string;
  public atras = true;
  public siguiente = true;
  public visualizarBtn = false;
  public valueCheck = 1;
  public contador = 0;
  public cantidadObligaciones = [];
  public mostrarContenido = false;
  public expediente: any;
  public resoluciones: Resolucion[] = [];
  public archivos: Archivos[] = [];
  public obligaciones: Obligaciones[];
  public isLoading = true;
  public isLoading2 = true;
  public isLoading3 = true;
  public displayBlock = false;
  public ocultarbotones = false;
  public sec: string;
  public secuenciaTercero: string;
  public expe: string | number;
  public secR: number;
  public formulario: FormGroup;
  public archivosArr: any[] = [];
  public lineR: number;
  public dataObligacion: object;
  public mostrar = false;
  public mostrar2 = false;
  public guardoObligaciones = false;
  public dataObligaciones: any[] = [];
  public documentosArr: any[] = [];
  public isSiguiente = false;
  public dataDelArchivo: any;
  public attachedFiles: Array<File> = [];
  public resolUser:any;
  public textoDesencriptado:any;
  public responsable: any;
  public banderaSiguiente = {'bandera':false, 'tipo': null };

  constructor(
    private activeRoute: ActivatedRoute,
    private expedienteService: ExpedienteService
  ) {
    this.resoluciones = [];
    this.obligaciones = [];
    this.archivos = [];
  }

  ngOnInit(): void {
    this.expedienteUrl();
    this.getDataLocalStorage();
    this.responsable =  JSON.parse(this.expedienteService.getData('responsable'));
    this.currentUserSubscription =  this.expedienteService.currentUser$.subscribe((user) => {
      this.cambioNombre = this.responsable.nombre? this.responsable?.nombre : user;
    });

    this.banderaSubscription = this.expedienteService.banderaExpe$.subscribe((siguienteB) =>{
      this.banderaSiguiente = siguienteB;
    });
  }

  seleccionarResolucion(resolucion){
    this.seleccionResolucion.emit(resolucion);
    this.expedienteService.saveData('RES', JSON.stringify(resolucion));
   // this.expedienteService.bandera({'bandera':false, 'tipo':null});

  }

  public expedienteUrl(): void {
    this.activeRoute.params.subscribe((expediente: any) => {
      this.expediente = expediente.expediente;
    });
  }
  public getDataLocalStorage(): void {
     const data = JSON.parse(localStorage.getItem('sec'));
      this.expedienteService.getListaExpedientes(data.sequenceThirdParty).pipe(
        // Filtra la lista para encontrar el expediente correcto
        switchMap((datas) => {
          if (datas.result) {

            let consultaResponsableBD;
            const expedienteEncontrado = datas.lista_expedientes.find((value) => {
              const { expediente, respon_nombre } = value;

              // Asignar el valor de respon_nombre a consultaResponsableBD
              consultaResponsableBD = respon_nombre;

              // Retornar true solo si el expediente coincide con this.expediente
              return expediente === this.expediente;
            });

        //    this.responsable.sequenceThirdParty2 = JSON.parse(localStorage.getItem('expediente'))
            if (expedienteEncontrado) {
              const newResolucion =  JSON.parse(localStorage.getItem('expediente') || undefined)


              // Guarda la resolución en localStorage
              this.expe = newResolucion | newResolucion.sequenceThirdParty2;
              const responsableGuardado = this.responsable;

              let tipoNatural = localStorage.getItem('isTipoPersona');

               this.responsable.sequenceThirdParty2 =  this.expe;
                return this.expedienteService.guardarInformacionResponsable(this.responsable).pipe(
                  tap((event) => {
                    if(tipoNatural !== 'N' ){
                      Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: '¡Datos de contacto guardados!',
                        showConfirmButton: false,
                        timer: 1500,
                      });
                      // Marcar como guardado
                      localStorage.setItem('responsableGuardado', 'true');
                    }
                  }),
                  catchError((error: HttpErrorResponse) => {
                    let incorrecto = JSON.stringify(error.error['text'])?.split('.')[0];
                    Swal.fire({
                      title: incorrecto,
                      icon: 'warning',
                    });
                    return of(null); // Devuelve un observable vacío en caso de error
                  })
                );

            }

          }
          return of(null); // Si no hay resultado, devolver un observable vacío
        }),
        switchMap((_) => {
          return this.expedienteService.postObtenerResolucion(String(this.expe)).pipe(
            tap((dataRe) => {

              if (dataRe.resoluciones) {
                const colum = dataRe.resoluciones.length;
                localStorage.setItem('colum', JSON.stringify(colum));

                this.resoluciones = dataRe.resoluciones;
                this.expedienteService.saveData('arrayR', JSON.stringify(this.resoluciones));
                this.isLoading = false;
                this.sinResolucion = false;
              }
              if(!dataRe.resoluciones.length){
                this.isLoading = true;
                this.sinResolucion = false;
              }
            }),
            catchError((error) => {
              console.log(error)
              if (error && error.message && error?.['error'].message.includes('No se encontraron resoluciones')) {
              // Si el backend envía un mensaje específico de que no hay datos
              this.isLoading = false;
              this.sinResolucion = true; // Mostrar el mensaje de "sin resoluciones"

            } else {
              // Manejo de otros errores
              this.isLoading = false;
              console.error('Ocurrió otro error inesperado');
            }

              return of(null); // Manejamos el error sin interrumpir el flujo
            })
          );
        }),
        take(1) // Tomar solo el primer valor emitido y completar el observable
      ).subscribe(

      );
    }
  public pasarEncima(e): void {
    this.mostrar = true;
  }

  public salirElemento(): void {
    this.mostrar = false;
  }

  public pasarEncima2(e): void {
    this.mostrar2 = true;
  }

  public salirElemento2(): void {
    this.mostrar2 = false;
  }

  ngOnDestroy(): void {
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
    if (this.banderaSubscription) {
      this.banderaSubscription.unsubscribe();
    }
  }

}
