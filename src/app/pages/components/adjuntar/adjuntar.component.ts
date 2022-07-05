import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { ExpedienteService } from 'src/app/core/services/expediente.service';
import { Archivos } from 'src/app/pages/components/interfaces/archivos';
import { ListasExpe } from 'src/app/pages/components/interfaces/lista-expe';
import { Obligaciones } from 'src/app/pages/components/interfaces/obligaciones.interface';
import { Resolucion } from 'src/app/pages/components/interfaces/resolucion.interface';
import introJs from 'intro.js/intro.js';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GuardarObligacionResponse } from 'src/app/pages/components/interfaces/guardar-obligacion-response';
import { MatAccordion } from '@angular/material/expansion';
import { ListaExpedienteArr } from 'src/app/pages/components/interfaces/lista_expediente-arr.interface';
import { ListaExpedientes } from 'src/app/pages/components/interfaces/lista_expedientes.interface';
import {
  ObligaArchivoDTO,
  ObligacionValue,
} from 'src/app/pages/components/interfaces/obligacion-value';
import { GuardarObligacionRequest } from 'src/app/pages/components/interfaces/guardar-obligacion-request';
import { StorageVariables } from 'src/app/core/services/storageVariables';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ListaTabla } from 'src/app/pages/components/interfaces/lista-tabla';
import { of } from 'rxjs';

import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';

import * as moment from 'moment';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { NotifierService } from 'angular-notifier';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCheckboxChange } from '@angular/material/checkbox';

enum SistemaCoordenada {
  ORIGEN_UNICO = 97377,
  WGS84 = 4326
}
export interface DataEvidencia {
  file?: File;
  isEvidencia?: boolean;
  coorX?: number;
  coorY?: number;
  niGradosLongitud?: number;
  longitud_min?: number;
  longitud_seg?: number;
  latitud_grados?: number;
  latitud_min?: number;
  latitud_seg?: number;
  fechaFoto?: string;
  niNroArchivo?: number;
  viMotivoParcial?: string;
  niSistemaCoordenada?: any;
  checkedCoor?:boolean;
}

export interface FormAndFiles {
  indexForm: number;
  data: DataEvidencia[];
}

@Component({
  selector: 'app-adjuntar',
  templateUrl: './adjuntar.component.html',
  styleUrls: ['./adjuntar.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-CO' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class AdjuntarComponent implements OnInit {
  form: FormGroup;
  ordersData = [];
  get ordersFormArray() {
    return this.form.controls.orders as FormArray;
  }

  @Output() selecSistem = new EventEmitter<any>();
  viMotivoParcial: string;
  public checkedCoor?: boolean;
  ComoTermina: string;
  NiSistemaCoordenada: number;
  total: number;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  panelOpenState = true;
  @Input() resolucionInput: Resolucion;
  @Input() expedienteInput: ListasExpe;
  url: SafeResourceUrl;
  @ViewChild('inputFile') inputFile: ElementRef;
  public nombreArchivo: string;
  public nombreObligacion: string;
  public ocultarObligacion = true;
  public valueArchivo: string;
  @Output() atrasPrimeroOut = new EventEmitter<any>();
  @Output() siguientePrimeroOut = new EventEmitter<any>();
  public atras = true;
  public siguiente = true;
  public visualizarBtn = false;
  public valueCheck = 1;
  public contador = 0;
  public cantidadObligaciones = [];
  public mostrarContenido = false;
  public expediente: any;
  public resoluciones: Resolucion[] = [];
  public listaExpediente: ListaExpedienteArr;
  public archivos: Archivos[] = [];
  public obligacionesList: Obligaciones[];
  public isLoading = true;
  public isLoading2 = true;
  public isLoading3 = true;
  public displayBlock = false;
  public ocultarbotones = false;
  public sec: string;
  public secuenciaTercero: string;
  public expe: string;
  public secR: number;
  public radicadoR: number;
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
  public cargoExpediente = true;
  public isEditableInicio = false;
  public completo1 = false;
  public pdfUrl;
  minDate: Date;
  maxDate: Date;

  /**DESARROLLO NUEVO */
  formObligaciones: FormGroup;
  formAndFiles: FormAndFiles[] = [];
  expansionPanelIndex = 0;

  public listObligacionArchivo: ObligaArchivoDTO[] = [];

  private maxFileSizeMB = 120;
  private maxFileSizeGB = 2;

  @ViewChild(MatAccordion, { static: false }) matAccordion: MatAccordion;
  niSistemaCoordenada: 4326 | 97377 = 97377;
  comoTermina: 'P' | 'T' = 'T';
  introJS = introJs();
  p: any;
  niSistemaCoordenadaSelected = null;

  SISTEMACOORDENADA = SistemaCoordenada;
  ORIGEN_UNICO_SELECTED = true;
  WSG84_SELECTED = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private expedienteService: ExpedienteService,
    private fb: FormBuilder,
    private stepper: MatStepper,
    private sanitizer: DomSanitizer,
    private notifierService: NotifierService
  ) {
    this.formObligaciones = this.fb.group({
      obligaciones: this.fb.array([this.createFormGroup()]),
    });
    this.formAndFiles.push({ indexForm: 0, data: [] });

    this.loadObligationsAndFiles();

  }

  startSteps(): void {
    this.introJS
      .setOptions({
        nextLabel: 'Siguiente',
        prevLabel: 'Atras',
        doneLabel: 'Fin',
        steps: [
          {
            element: '#step1-li',
            intro:
              'Este icono le permitira crear nuevos formularios para cargar sus obligaciones.',
          },
          {
            element: '#step2-li',
            intro:
              'Ingrese el nombre de la obligación con la que identificaremos su obligación.',
          },
          {
            element: '#step3-li',
            intro:
              'Ingrese detalles que considere ayudaran a relacionar los archivos presentados.',
          },
          {
            element: '#step4-li',
            intro:
              'Ingrese imagenes una a una con extenciones como JPG,PNG con su respectiva coordenada y fecha de la imagen. Cuando lo requiera.',
          },
          {
            element: '#step5-li',
            intro:
              'Ingrese archivos como PDF, WORD, XLSX,XLSM, ZIP, DOC,DOCX. Con un peso no mayor a 120MB y en archivos ZIP no mayores a 2GB. Ingrese estos archivos seleccionandolos al tiempo en su carpeta de origen y teniendo un orden lógico.',
          },
          {
            element: '#step6-li',
            intro:
              'Marque según corresponda en su caso, si la actual obligación se esta entregando de manera PARCIAL o COMPLETA. En caso si es parcial, describa la razón de esta entrega PARCIAL.',
          },
          {
            element: '#step7',
            intro: '👏 La obligación esta terminada, podemos darle GUARDAR.',
          },
        ],
        hidePrev: true,
        hideNext: false,
      })
      .start();
  }

  buildOrderItemsForm(ordersData): FormGroup {
    return this.fb.group({
      id: ordersData.id,
      name: ordersData.name,
    });
  }

  ngOnInit(): void {
    this.introJS.start();
    this.expedienteUrl();
    this.getDataLocalStorage();
    //this.consultaObligacion();
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 1, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
  }

  ///primer formulario

  get obligacionesFormArray() {
    return this.formObligaciones.controls['obligaciones'] as FormArray;
  }

  createFormGroup(value?: ObligacionValue): FormGroup {
    const formGroup = this.fb.group({
      line: null,
      descripcion: [],
      observaciones: [],
      viMotivoParcial: [],
      sistema_coordenadas: [],
    });

    if (value) {
      formGroup.setValue(value);
    }
    return formGroup;
  }

  /**
   * Cargar las obligaciones y archivos registrados anteriormtente.
   *
   */
  async loadObligationsAndFiles() {
    const dtoArchivo = {
      sequenceThirdParty2: parseInt(StorageVariables.sequenceThirdParty2()),
      sequenceThirdParty: parseInt(StorageVariables.sequenceThirdParty()),
    };
    const dataResponse: ListaTabla[] = await this.expedienteService.consultaArchivo(dtoArchivo).toPromise();
    if (dataResponse.length) {
      localStorage.setItem('dataResponse', JSON.stringify(dataResponse));

      this.formAndFiles = [] as FormAndFiles[];
      const arrayForms: FormGroup[] = [];
      dataResponse.forEach((item: ListaTabla, indexForm) => {
        let obligacionValueForm: ObligacionValue = null;
        let dataEvidenciaList: DataEvidencia[] = [];

        item.archivos.forEach((archivo, indexFile) => {
          obligacionValueForm = {
            descripcion: archivo.obligaDescripcion,
            observaciones: archivo.obligaObservacion,
            viMotivoParcial: archivo.viMotivoParcial,
            line: String(item.obligaLinea),
            sistema_coordenadas: archivo.sistema_coordenadas
          };

          // SE CREAN LOS ARCHIVOS AL FORMULARIO CREADO SEGUN LA POSICION DE CADA UNA DE LAS OBLIGACIONES EN EL FOR
          let dataEvidenciaValue: DataEvidencia = {};

          let file = new File([], archivo.archivoNombre);

          if (archivo.coorX || archivo.niGradosLongitud) {
            // SI LA VARIABLE coorX TIENE UN VALOR, ES PORQUE ES UN ARCHIVO DE TIPO EVIDENCIA DE LO CONTRARIO ES UN ARCHIVO DE TIPO INFORME
            dataEvidenciaValue = {
              isEvidencia: true,
              coorX: archivo.coorX,
              coorY: archivo.coorY,
              niGradosLongitud: archivo.niGradosLongitud,
              longitud_min: archivo.longitud_min,
              longitud_seg: archivo.longitud_seg,
              latitud_grados: archivo.latitud_grados,
              latitud_min: archivo.latitud_min,
              latitud_seg: archivo.latitud_seg,
              niSistemaCoordenada: archivo.sistema_coordenadas,
              fechaFoto: String(archivo.fechaFoto),
              file,
              niNroArchivo: archivo.archivoNro,              
            };   
            
          } else {
            dataEvidenciaValue = {
              isEvidencia: false,
              coorX: 0,
              coorY: 0,
              niGradosLongitud:0,
              longitud_min: 0,
              longitud_seg: 0,
              latitud_grados: 0,
              latitud_min:0,
              latitud_seg:0,
              niSistemaCoordenada: 0,
              fechaFoto: null,
              file,
              niNroArchivo: archivo.archivoNro,
            };
          }
          dataEvidenciaList.push(dataEvidenciaValue);
          
        });

        // SE CREA UN FORMULARIO SEGUN LA POSICION
        const formObligacion = this.createFormGroup(obligacionValueForm);
        arrayForms.push(formObligacion);
        this.formAndFiles.push({
          indexForm: indexForm,
          data: dataEvidenciaList,
        });
      });

      this.formObligaciones = this.fb.group({
        obligaciones: this.fb.array(arrayForms),
      });
    }
  }

  addFormObligacion() {
    this.formAndFiles.push({
      indexForm: this.obligacionesFormArray.length,
      data: [],
    });
    const formObligacion = this.createFormGroup();
    this.obligacionesFormArray.push(formObligacion);
   
  }

  deleteFormObligacion(indexForm: number) {
    const sequenceThirdParty = JSON.parse(
      localStorage.getItem('sec')
    ).sequenceThirdParty;
    const sequenceThirdParty2 = JSON.parse(
      localStorage.getItem('expediente')
    ).sequenceThirdParty2;

    const formGroup: FormGroup = this.obligacionesFormArray.controls[
      indexForm
    ] as FormGroup;
    const line = formGroup.controls.line.value;
    if (line) {
      this.expedienteService
        .eliminarObligacion(line, sequenceThirdParty, sequenceThirdParty2)
        .subscribe(
          (resp) => {
            this.obligacionesFormArray.removeAt(indexForm);
            //this.obligacionesFormArray.clear();
          },
          (error) => {
            alert(JSON.stringify(error.error.text));
          }
        );
    } else {
      this.obligacionesFormArray.removeAt(indexForm);
    }
  }

  selectFiles(fileList: FileList, indexForm: number, isEvidencia: boolean) {
    const formAndFileByIndexForm: FormAndFiles = this.formAndFiles.find(
      (item) => item.indexForm === indexForm
    );

    Array.from(fileList).forEach((file: File) => {
      if (this.validarTamanioArchivo(file)) {
        const dataEvidencia: DataEvidencia = {
          file: file,
          isEvidencia: isEvidencia,
          //viMotivoParcial:this.viMotivoParcial
        };
        formAndFileByIndexForm.data.push(dataEvidencia);
      } else {
        alert('El archivo ' + file.name + ' excede el limite de tamaño');
        //this.notifierService.show({message:'El archivo '+file.name+' excede el limite de tamaño de '+(this.maxSize/1024)+'MB' ,type:'warning'});
      }
    });
  }
  validarTamanioArchivo(file: File): boolean {
    var filesize = file.size / 1024 / 1024;
    var ext = file.name.split('.').pop();
    var maxSize = ext == 'zip' ? 2 * 1024 : this.maxFileSizeMB;
    return filesize <= maxSize;
  }

  setValueEvidencia(
    event: Event | MatDatepickerInputEvent<Date>,
    type: string,
    indexFile: number,
    indexForm: number
  ) {
    let value = null;
    if (event instanceof MatDatepickerInputEvent) {
      value = event.value.toISOString();
    } else {
      value = (event.target as HTMLInputElement).value;
    }
    const dataEvidencia: DataEvidencia[] = this.filesByFormIndexList(indexForm);

    switch (type) {
      case 'coorX':
        dataEvidencia[indexFile].coorX = value;
        break;
      case 'coorY':
        dataEvidencia[indexFile].coorY = value;
        break;
      case 'fechaFoto':
        dataEvidencia[indexFile].fechaFoto = value;
        break;
      case 'niGradosLongitud':
        dataEvidencia[indexFile].niGradosLongitud = value;
        break;
      case 'niMinLongitud':
        dataEvidencia[indexFile].longitud_min = value;
        break;
      case 'niSegLongitud':
        dataEvidencia[indexFile].longitud_seg = value;
        break;
      ////y
      case 'niGradosLatitud':
        dataEvidencia[indexFile].latitud_grados = value;
        break;
      case 'niMinLatitud':
        dataEvidencia[indexFile].latitud_min = value;
        break;
      case 'niSegLatitud':
        dataEvidencia[indexFile].latitud_seg = value;
        break;
      case 'niSistemaCoordenada':
        dataEvidencia[indexFile].niSistemaCoordenada = this.niSistemaCoordenada;
        break;
    }
   
  }

  deletedFile(indexForm: number, indexFile: number, fileName: string) {
    const sequenceThirdParty = JSON.parse(
      localStorage.getItem('sec')
    ).sequenceThirdParty;
    const sequenceThirdParty2 = JSON.parse(
      localStorage.getItem('expediente')
    ).sequenceThirdParty2;

    const formGroupByIndexForm: FormGroup = this.obligacionesFormArray.controls[
      indexForm
    ] as FormGroup;
    const formAndFilesByIndexForm: FormAndFiles = this.formAndFiles.find(
      (item) => item.indexForm === indexForm
    );
   
    const niLineaObligacion = formGroupByIndexForm.controls.line.value;
    if (niLineaObligacion) {
      const dataEvidence: DataEvidencia =
        formAndFilesByIndexForm.data[indexFile];
      if (dataEvidence.niNroArchivo) {
        const params = {
          niLineaObligacion,
          niNroArchivo: dataEvidence.niNroArchivo,
          sequenceThirdParty,
          sequenceThirdParty2,
        };
        this.expedienteService.eliminarArchivos(params).subscribe(
          (data) => {
            formAndFilesByIndexForm.data.splice(indexFile, 1);
          },
          (ex: HttpErrorResponse) => {
            alert('No se pudo eliminar el archivo\n' + JSON.stringify(ex));
          }
        );
      } else {
        formAndFilesByIndexForm.data.splice(indexFile, 1);
      }
    } else {
      formAndFilesByIndexForm.data.splice(indexFile, 1);
      //this.obligacionesFormArray.clear();
    }
  }

  filesByFormIndexList(indexForm): DataEvidencia[] {
    const formAndFile: FormAndFiles = this.formAndFiles.find(
      (item) => item.indexForm === indexForm
    );
    if (formAndFile && formAndFile.data) {
      return formAndFile.data;
    }
    return [];
  }

  public expedienteUrl(): void {
    this.activeRoute.params.subscribe((expediente: any) => {
      this.expediente = expediente.expediente;
    });
  }
  public getDataLocalStorage(): void {
    const data = JSON.parse(localStorage.getItem('sec'));
    const radicado_R = JSON.parse(localStorage.getItem('radicadoR'));
    const sequenceThirdParty = JSON.parse(
      localStorage.getItem('sec')
    ).sequenceThirdParty;
    const sequenceThirdParty2 = JSON.parse(
      localStorage.getItem('expediente')
    ).sequenceThirdParty2;
    this.radicadoR = radicado_R.toString();

    this.sec = data;
    this.secuenciaTercero = data.sequenceThirdParty;
    this.expedienteService
      .getListaExpedientes(data.sequenceThirdParty)
      .subscribe((datas: ListaExpedientes) => {
        if (datas.result) {
          datas.lista_expedientes.filter((value) => {
            if (value.expediente === this.expediente) {
              this.listaExpediente = value;
              const newResolucion = {
                sequenceThirdParty2: value.exp_sec.toString(),
              };
              localStorage.setItem('expediente', JSON.stringify(newResolucion));
              this.expe = newResolucion.sequenceThirdParty2;
            }
          });
        }
      });
  }
  getOrders() {
    return [
      { id: SistemaCoordenada.ORIGEN_UNICO, name: 'Origen Único' },
      { id: SistemaCoordenada.WGS84, name: 'WGS84' },
    ];
  }

  changee(event: MatCheckboxChange) {  
    
    if (event.checked) {
      let coordenada = null;
      if (event.source.name === 'WGS84') {
        
      this.WSG84_SELECTED = true; 
        this.ORIGEN_UNICO_SELECTED = false; 
        coordenada = SistemaCoordenada.WGS84;
      } else {        
         this.WSG84_SELECTED = false; 
        this.ORIGEN_UNICO_SELECTED = true; 
        coordenada = SistemaCoordenada.ORIGEN_UNICO;        
      }
      sessionStorage.setItem('coor', JSON.stringify(coordenada));
      console.log(coordenada);
    }        
  }

  saveObligation(indexForm: number) {
    const obligacionValue: ObligacionValue =
      this.obligacionesFormArray.controls[indexForm].value;
    var data = sessionStorage.getItem('coor');
    const guardarObligacion: GuardarObligacionRequest = {
      observaciones: obligacionValue.observaciones,
      secResol: this.radicadoR,
      descripcion: obligacionValue.descripcion,
      viMotivoParcial: obligacionValue.viMotivoParcial,
      nioLinea: +obligacionValue.line,

      sequenceThirdParty: Number(this.secuenciaTercero),
      sequenceThirdParty2: Number(this.expe),
      comoTermina: this.comoTermina,
      niSistemaCoordenada: data,
    };
    console.log(data);
    Swal.fire({
      title: 'Desea Guardar cambios?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Guardar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.expedienteService
          .postGuardarObligacion(guardarObligacion)
          .subscribe((obligacionResponse: GuardarObligacionResponse) => {
            const formGroup: FormGroup = this.obligacionesFormArray.controls[
              indexForm
            ] as FormGroup;
            formGroup.controls.line.setValue(obligacionResponse.line);

            if (obligacionResponse.result) {
              const formAndFile: FormAndFiles = this.formAndFiles.find(
                (item) => item.indexForm === indexForm
              );
              if (formAndFile && formAndFile.data && formAndFile.data.length) {
              }
              //TODO: Validar que files exista
              let ultimo = formAndFile.data.length;
              let contador = 0;

              if (ultimo == 0) {
                // this.cargarOblicaciones();
              }
              formAndFile.data.forEach((dataEvidencia: DataEvidencia) => {
                contador++;
                const fileData = new FormData();
                fileData.append('sequenceThirdParty2', this.expe);
                fileData.append('sequenceThirdParty', this.secuenciaTercero);
                fileData.append('line', obligacionResponse.line);
                fileData.append('file', dataEvidencia.file);
                fileData.append(
                  'coorX',
                  dataEvidencia.coorX ? String(dataEvidencia.coorX) : '0'
                );
                fileData.append(
                  'coorY',
                  dataEvidencia.coorY ? String(dataEvidencia.coorY) : '0'
                );
                fileData.append('niSistemaCoordenada', String(data));
                fileData.append(
                  'niGradosLongitud',
                  dataEvidencia.niGradosLongitud
                    ? String(dataEvidencia.niGradosLongitud)
                    : '0'
                );
                fileData.append(
                  'niMinLongitud',
                  dataEvidencia.longitud_min
                    ? String(dataEvidencia.longitud_min)
                    : '0'
                );
                fileData.append(
                  'niSegLongitud',
                  dataEvidencia.longitud_seg
                    ? String(dataEvidencia.longitud_seg)
                    : '0'
                );
                fileData.append(
                  'niGradosLatitud',
                  dataEvidencia.latitud_grados
                    ? String(dataEvidencia.latitud_grados)
                    : '0'
                );
                fileData.append(
                  'niMinLatitud',
                  dataEvidencia.latitud_min
                    ? String(dataEvidencia.latitud_min)
                    : '0'
                );
                fileData.append(
                  'niSegLatitud',
                  dataEvidencia.latitud_seg
                    ? String(dataEvidencia.latitud_seg)
                    : '0'
                );
                fileData.append(
                  'fechaFoto',
                  dataEvidencia.fechaFoto
                    ? moment(
                        String(dataEvidencia.fechaFoto),
                        'YYYY-MM-DD'
                      ).format('YYYY-MM-DD')
                    : null
                );
                console.log(this.niSistemaCoordenada);
                fileData.append(
                  'expediente',
                  StorageVariables.expedienteActual().expediente
                );
                this.expedienteService
                  .postGuardarArchivo(fileData)
                  .subscribe((line) => {
                    if (ultimo == contador) {
                      Swal.fire('Obligacion guardada!', '', 'success');
                      this.matAccordion.closeAll();
                    }
                  }),
                  (ex: HttpErrorResponse) => {
                    alert(JSON.stringify(ex));
                  };
              });
            }
          });

        Swal.fire('Obligacion guardada!', '', 'success');
        this.matAccordion.closeAll();
      } else if (result.isDenied) {
        Swal.fire('No guardar cambios', '', 'info');
      } else {
        alert('lo sentimos, no guardo la obligación');
      }
    });
  }
  public siguientePrimero(): void {
    this.siguientePrimeroOut.emit(true);
    const sec = JSON.parse(localStorage.getItem('sec'));
    const expediente = JSON.parse(localStorage.getItem('expediente'));

    let data = {
      sequenceThirdParty: sec.sequenceThirdParty,
      sequenceThirdParty2: expediente.sequenceThirdParty2,
    };
    this.stepper.next();
  }
  public atrasPrimero(): void {
    this.atrasPrimeroOut.emit(this.atras);
  }

  cambiarCheckboxEstadoObligacion(indexForm, control) {
    console.log(indexForm, control);
    let opuesto = control == 'parcial' ? 'total' : 'parcial';
    let currentForm =
      this.formObligaciones.controls['obligaciones']['controls'][indexForm];
    currentForm.controls[opuesto].setValue(false);
  }
  validarMostrarTextoParcial(indexForm) {
    return this.formObligaciones.controls['obligaciones']['controls'][
      indexForm
    ]['controls']['parcial']['value'];
  }
}
