import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import introJs from 'intro.js/intro.js';
import Swal from 'sweetalert2';
import { SafeResourceUrl } from '@angular/platform-browser';
import { MatAccordion } from '@angular/material/expansion';
import { EMPTY, from, Observable } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { catchError, concatMap, debounceTime, tap } from 'rxjs/operators';
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
import { MatRadioChange } from '@angular/material/radio';

import { ExpedienteService } from 'src/app/core/services/expediente.service';

import { Archivos } from 'src/app/pages/components/interfaces/archivos';
import { ListasExpe } from 'src/app/pages/components/interfaces/lista-expe';
import { Obligaciones } from 'src/app/pages/components/interfaces/obligaciones.interface';
import { Resolucion } from 'src/app/pages/components/interfaces/resolucion.interface';
import { GuardarObligacionResponse } from 'src/app/pages/components/interfaces/guardar-obligacion-response';
import { GuardarObligacionRequest } from 'src/app/pages/components/interfaces/guardar-obligacion-request';
import { ListaExpedienteArr } from 'src/app/pages/components/interfaces/lista_expediente-arr.interface';
import { ListaExpedientes } from 'src/app/pages/components/interfaces/lista_expedientes.interface';
import {
  ObligaArchivoDTO,
  ObligacionValue,
} from 'src/app/pages/components/interfaces/obligacion-value';

import { StorageVariables } from 'src/app/core/services/storageVariables';
import { ListaTabla } from 'src/app/pages/components/interfaces/lista-tabla';
import {
  HttpErrorResponse,
  HttpEventType,
  HttpEvent,
} from '@angular/common/http';

enum SistemaCoordenada {
  ORIGEN_UNICO = 9377,
  WGS84 = 4326,
}
export interface DataEvidencia {
  file?: File;
  fileIndex?: number;
  isEvidencia?: boolean;
  viUbicacionArchivo?: string;
  coorX?: number;
  coorY?: number;
  niGradosLongitud?: number;
  niMinLongitud?: number;
  longitud_min?: number;
  longitud_seg?: number;
  niSegLongitud?: number;
  latitud_grados?: number;
  latitud_min?: number;
  latitud_seg?: number;
  fechaFoto?: string;
  niNroArchivo?: number;
  viMotivoParcial?: string;
  niSistemaCoordenada?: any;
  checkedCoor?: boolean;
  data?: number;
  spinner?: boolean;
  obligaLinea?: number;
  fechaIngresoArchivo?: any;
  fechaFotoRequired?: boolean;
  expediente?: string;
  comoTermina?: string;
  agno_mes?:string;
}

export interface GuardarObligacionResponseFile {
  result: boolean;
  line: string;
  mensaje: string;
}

export interface FormAndFiles {
  indexForm: number;
  data: DataEvidencia[];
  comoTermina?: string | undefined;
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
  uploadProgress: number = 0;
  uploadSub: boolean = false;
  selectedFiles?: FileList;
  currentFile?: File;
  fileInfos?: Observable<any>;
  progressInfo = [];
  imageName = '';
  form: FormGroup;
  url: SafeResourceUrl;

  @Output() actualiza = new EventEmitter<boolean>();
  @Output() selecSistem = new EventEmitter<any>();

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() resolucionInput: Resolucion;
  @Input() expedienteInput: ListasExpe;
  @ViewChild('inputFile') inputFile: ElementRef<HTMLInputElement>;
  @ViewChild('inputFileEvidencia', { static: false })
  inputFileEvidencia!: ElementRef<HTMLInputElement>;
  @ViewChild('addObligacion', { static: false })
  addObligacion!: ElementRef<HTMLInputElement>;
  @ViewChild(MatAccordion, { static: false }) matAccordion: MatAccordion;
  @Output() atrasPrimeroOut = new EventEmitter<any>();
  @Output() siguientePrimeroOut = new EventEmitter<any>();
  @Output() evento = new EventEmitter<boolean>();
  public filesCache: FormAndFiles[];
  public imgCache: any;
  public validateImg: boolean = false;
  public viMotivoParcial: string;
  public checkedCoor?: boolean;
  public ComoTermina: string;
  public NiSistemaCoordenada: number;
  public total: number;
  public nombreArchivo: string;
  public nombreObligacion: string;
  public ocultarObligacion = true;
  public valueArchivo: string;
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
  public pdfSrc;
  public obli;
  public files: string;
  public conObligaciones: boolean;
  minDate: Date;
  maxDate: Date;

  generatedPDF: any;

  /**DESARROLLO NUEVO */
  public formObligaciones: FormGroup;
  public formAndFiles: FormAndFiles[] = [];

  public listObligacionArchivo: ObligaArchivoDTO[] = [];
  private maxFileSizeMB = 2048;
  public expanded: boolean;

  public niSistemaCoordenada: 4326 | 9377 = 9377;
  public comoTermina: 'P' | 'T' = 'T';
  introJS = introJs();
  public niSistemaCoordenadaSelected = null;
  public SISTEMACOORDENADA = SistemaCoordenada;
  //public ORIGEN_UNICO_SELECTED = false;
  //public WSG84_SELECTED = false;
  public adjuntos: string = '';
  filenames: string[] = [];
  fileStatus = { status: '', requestType: '', percent: 0 };
  formGroup: FormGroup;
  public statusObliga: boolean = false;
  /* seccion de imagenes para permitir solo 1 */
  public noTieneDatos: boolean;
  fileList: File[] = [];
  listOfFiles: any[] = [];
  public stausResponse: number | string;
  public slecOrdenadas: boolean;
  fileNameImg: string;
  isDisabled: boolean = false;
  isDisabledN: boolean = false;
  isDisabledG: boolean = false;
  public mensajeNacional: string;
  public mensajeGeo: string;
  @ViewChild('autoHeightTextarea', { static: false }) textarea: ElementRef;
  public mostrarFormulario: boolean = false;
  public inputTouched: boolean = false;
  public temporal: boolean;
  public loadOblig: boolean;
  public cacheComoTermina: any;
  soloCrear: boolean;
  selectedFile: File;
  repetdoImg: boolean;
  WSG84_SELECTED: boolean[] = [];
  ORIGEN_UNICO_SELECTED: boolean[] = [];
  constructor(
    private activeRoute: ActivatedRoute,
    private expedienteService: ExpedienteService,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.formObligaciones = this.fb.group({
      obligaciones: this.fb.array([this.createFormGroup()]),
    });
    this.formAndFiles.push({ indexForm: 0, data: [], comoTermina: '' });

    this.loadObligationsAndFiles();
  }

  startSteps(): void {
    this.expanded = true;
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

  ngOnInit(): void {
    this.fileInfos = this.expedienteService.getFiles();
    this.introJS.start();
    this.expedienteUrl();
    this.getDataLocalStorage();
  }

  ngAfterViewInit(): void {
    const textarea = this.textarea?.nativeElement;

    if (textarea !== undefined) {
      const textareaAutoHeight = (el: HTMLElement, offsetTop = 0) => {
        this.renderer.setStyle(el, 'height', 'auto');
        this.renderer.setStyle(
          el,
          'height',
          `${el?.scrollHeight + offsetTop}px`
        );
      };

      // Inicializar la altura del textarea
      textareaAutoHeight(textarea, 3);

      // Ajustar la altura del textarea en cada entrada de texto
      this.renderer.listen(textarea, 'input', () => {
        textareaAutoHeight(textarea, 3);
      });
    }
  }

  limpiarRadio(indexForm: number, indexFile: number, fileName?: string) {
    this.deletedFile(indexForm, indexFile, fileName);

    return (this.slecOrdenadas = false);
  }

  ///primer formulario

  get obligacionesFormArray() {
    return this.formObligaciones.controls['obligaciones'] as FormArray;
  }

  createFormGroup(value?: ObligacionValue): FormGroup {
    this.formGroup = this.fb.group({
      line: null,
      descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
      observaciones: ['', [Validators.required, Validators.maxLength(1000)]],
      viMotivoParcial: ['', [Validators.maxLength(150)]],
      sistema_coordenadas: [],
    });

    if (value) {
      this.formGroup.setValue(value);
    }
    return this.formGroup;
  }

  isValidField(field: string, indexForm: number): boolean | null {
    if (
      this.formObligaciones.controls['obligaciones']['controls'][indexForm]
        ?.controls['line'].value === null ||
      this.formObligaciones.controls['obligaciones']['controls'][indexForm]
        ?.controls['viMotivoParcial'].value !== 'N/A'
    ) {
      return (
        this.formObligaciones.controls['obligaciones']['controls'][indexForm]
          .controls[field].errors &&
        this.formObligaciones.controls['obligaciones']['controls'][indexForm]
          .controls[field].touched
      );
    }
    return null;
  }

  getFieldError(field: string, indexForm: number): string | null {
    if (
      !this.formObligaciones.controls['obligaciones']['controls'][indexForm]
        .controls[field]
    )
      return null;

    const errors =
      this.formObligaciones.controls['obligaciones']['controls'][indexForm]
        .controls[field].errors || {};
    if (
      this.formObligaciones.controls['obligaciones']['controls'][indexForm]
        ?.controls['line'].value === null ||
      this.formObligaciones.controls['obligaciones']['controls'][indexForm]
        ?.controls['viMotivoParcial'].value !== 'N/A'
    ) {
      for (const key of Object.keys(errors)) {
        switch (key) {
          case 'required':
            return 'Este campo es requerido.';

          case 'maxlength':
            return (
              errors?.['maxlength']['requiredLength'] +
              '/' +
              errors?.['maxlength']['actualLength'] +
              ' ' +
              ', Se excedió el límite de ' +
              errors?.['maxlength']['requiredLength'] +
              ' caracteres.'
            );
        }
      }
    }

    return null;
  }

  /**
   * Cargar las obligaciones y archivos registrados anteriormtente.
   */
  async loadObligationsAndFiles() {
    try {
      this.expanded = false;
      const dtoArchivo = {
        sequenceThirdParty2: parseInt(StorageVariables.sequenceThirdParty2()),
        sequenceThirdParty: parseInt(StorageVariables.sequenceThirdParty()),
      };
      const dataResponse: ListaTabla[] = await this.expedienteService
        .consultaArchivo(dtoArchivo)
        .toPromise();

      // Verifica si el array está vacío
      if (dataResponse == null || dataResponse.length === 0 || !dataResponse) {
        console.warn('La consulta no devolvió datos');

        this.mostrarFormulario = true;
        this.evento.emit(true);
        this.conObligaciones = false;
        this.temporal = false;
        this.loadOblig = false;
      } else {
        this.expedienteService.saveData(
          'dataResponse',
          JSON.stringify(dataResponse)
        );
        /* botones de regresar y cargar img */
        this.conObligaciones = true;
        this.evento.emit(false);
        this.loadOblig = true;
        this.temporal = true;
        /*                         */
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
              sistema_coordenadas: archivo.sistema_coordenadas,
            };

            // SE CREAN LOS ARCHIVOS AL FORMULARIO CREADO SEGUN LA POSICION DE CADA UNA DE LAS OBLIGACIONES EN EL FOR
            let dataEvidenciaValue: DataEvidencia = {};
            let file = new File([], archivo.archivoNombre);

            if (archivo.coorX || archivo.niGradosLongitud) {
              this.mostrarFormulario = true;
              // SI LA VARIABLE coorX TIENE UN VALOR, ES PORQUE ES UN ARCHIVO DE TIPO EVIDENCIA DE LO CONTRARIO ES UN ARCHIVO DE TIPO INFORME
              dataEvidenciaValue = {
                isEvidencia: true,
                viUbicacionArchivo: 'DB',
                coorX: archivo.coorX != null ? archivo.coorX : 0,
                coorY: archivo.coorY != null ? archivo.coorY : 0,
                niGradosLongitud: archivo.niGradosLongitud,
                longitud_min: archivo.longitud_min,
                niSegLongitud: archivo.longitud_seg,
                latitud_grados: archivo.latitud_grados,
                latitud_min: archivo.latitud_min,
                latitud_seg: archivo.latitud_seg,
                niSistemaCoordenada: archivo.sistema_coordenadas,
                fechaFoto: String(archivo.fechaFoto),
                file,
                niNroArchivo: archivo.archivoNro,
                obligaLinea: archivo.obligaLinea,
                fechaIngresoArchivo: archivo.fechaIngresoArchivo,
                expediente: archivo.expediente,
                viMotivoParcial: archivo.viMotivoParcial,
                agno_mes: localStorage.getItem('agno') != null ? localStorage.getItem('agno') : null

              };
            } else {
              this.mostrarFormulario = true;
              dataEvidenciaValue = {
                viUbicacionArchivo: 'DB',
                isEvidencia: false,
                coorX: 0,
                coorY: 0,
                niGradosLongitud: 0,
                niMinLongitud: 0,
                niSegLongitud: 0,
                latitud_grados: 0,
                latitud_min: 0,
                latitud_seg: 0,
                niSistemaCoordenada: 0,
                data: 0,
                fechaFoto: null,
                file,
                niNroArchivo: archivo.archivoNro,
                fechaIngresoArchivo: archivo.fechaIngresoArchivo,
                expediente: archivo.expediente,
                obligaLinea: archivo.obligaLinea,
                comoTermina: archivo.comoTermina,
                viMotivoParcial: archivo.viMotivoParcial,
                agno_mes: localStorage.getItem('agno') != null ? localStorage.getItem('agno') : null
              };
              //this.obligaByFormList(indexForm);
            }
            if(!dataEvidenciaValue.file.name)return;
            dataEvidenciaList.push(dataEvidenciaValue);
          });

          // SE CREA UN FORMULARIO SEGUN LA POSICION
          const formObligacion = this.createFormGroup(obligacionValueForm);
          arrayForms.push(formObligacion);
          this.formAndFiles.push({
            indexForm: indexForm,
            data: dataEvidenciaList,
            comoTermina: item.comoTermina,
          });

          this.filesCache = this.formAndFiles;
          this.imgCache = this.filesCache !== null ? this.filesCache : [];
        });

        this.formObligaciones = this.fb.group({
          obligaciones: this.fb.array(arrayForms),
        });
      }
    } catch (error) {
      // Captura errores de la llamada al servicio
      console.error('Error al consultar archivos:', error);
      // Aquí puedes manejar el error, como mostrar un mensaje al usuario
    }
  }

  addFormObligacion() {
    this.formAndFiles.push({
      indexForm: this.obligacionesFormArray.length,
      data: [],
    });

    this.filesCache = this.formAndFiles;
    this.imgCache = this.filesCache !== null ? this.filesCache : [];
    const formObligacion = this.createFormGroup();
    this.obligacionesFormArray.push(formObligacion);
  }

  async deleteFormObligacion(indexForm: number) {
    await Swal.fire({
      title: '¿Desea Eliminar esta obligación.?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Eliminar`,
    }).then((result) => {
      if (result.isConfirmed) {
        const sequenceThirdParty = JSON.parse(
          localStorage.getItem('sec')
        ).sequenceThirdParty;
        const sequenceThirdParty2 = JSON.parse(
          localStorage.getItem('expediente')
        ).sequenceThirdParty2;
        this.inputTouched = false;
        this.isDisabled = false;
        const formGroup: FormGroup = this.obligacionesFormArray.controls[
          indexForm
        ] as FormGroup;
        const line = formGroup.controls.line.value;
        if (line) {
          this.filesCache = this.formAndFiles;
          this.imgCache = this.filesCache !== null ? this.filesCache : [];
          this.expedienteService
            .eliminarObligacion(line, sequenceThirdParty, sequenceThirdParty2)
            .subscribe(
              (resp) => {
                this.obligacionesFormArray.removeAt(indexForm);
                this.loadObligationsAndFiles();
              },
              (error: HttpErrorResponse) => {
                if (error?.error['text'].includes('No puede borrar')) {
                  Swal.fire({
                    title: 'Error al borrar.',
                    text: 'Elimina los archivos adjuntos primero.',
                  });
                } else {
                  Swal.fire({
                    title: 'Error inesperado.',
                    text: 'No es posible eliminar, recarga tu navegador y vuelve a intentarlo.',
                  });
                }
              }
            );
        } else {
          this.obligacionesFormArray.removeAt(indexForm);
        }
      }
    });
  }

  selectFiles(
    fileList: FileList,
    indexForm: number,
    isEvidencia: boolean,
    event: any
  ): void {
    const inicio = this.filesCache ? this.filesCache : this.formAndFiles;
    const formAndFileByIndexForm: FormAndFiles = inicio.find(
      (item) => item.indexForm === indexForm
    );
    let indexFile = formAndFileByIndexForm?.data.length || 0;
    Array.from(fileList)?.forEach((file: File) => {
      if (!file) return; // Ignora archivos nulos o indefinidos


      this.selectedFile = file;
      this.fileList.push(this.selectedFile);

      const dataEvidencia: DataEvidencia = {
        file: this.selectedFile,
        isEvidencia,
        viUbicacionArchivo: 'DB',
        fileIndex:indexFile
      };


    // Verifica si el archivo es nulo o duplicado
    if (!dataEvidencia.file?.name || formAndFileByIndexForm?.data.some((item) => item.file.name === file.name)) {
      Swal.fire({
        title: 'Archivo no válido o duplicado: ' + file.name,
        icon: 'warning',
      });
      this.fileList.pop();
      return;
    }

      if (isEvidencia === false) {
        this.inputTouched = false;

        if(!dataEvidencia.file.name)return;

        if (this.validarExtArchivo(file) && this.validarTamanioArchivo(file)) {
          if (!this.filesCache || !this.filesCache[indexForm]?.data) {
            this.filesCache = this.formAndFiles;
          }

          indexFile++;

          dataEvidencia.fileIndex= indexFile;
          formAndFileByIndexForm?.data.push(dataEvidencia);
        } else {
          Swal.fire(
            'El archivo ' + file.name + ' es una imagen; debes cargarlo en el apartado 2'
          );
        }
      }

      if (isEvidencia === true) {
        this.inputTouched = true;
        if(!dataEvidencia.file.name)return;

        if (!this.filesCache || !this.filesCache[indexForm]?.data) {
          this.filesCache = this.formAndFiles;
        }

        indexFile++;


        dataEvidencia.fileIndex= indexFile;
        formAndFileByIndexForm?.data.push(dataEvidencia);
      }

    });

    event.target.value = ''; // Limpia el valor del input de archivo
  }


  getEvidenciaFiles(indexForm: number): any[] {
    return this.filesCache[indexForm]?.data?.filter(item => !item.isEvidencia) || [];
  }

  validarTamanioArchivo(file: File): boolean {

       // const ext = file.name.split('.').pop()?.toLowerCase();

      // let maxSize;
       // Definir tamaños máximos según la extensión
   /*     switch (ext) {
         case 'zip':
           maxSize = 2 * 1024;
           break;
         case 'rar':
           maxSize = 2 * 1024;
           break;
         case 'tar':
           maxSize = 2 * 1024;
           break;
         default:
           maxSize = this.maxFileSizeMB;
           break;
       }

       1MB=1,048,576bytes
       un megabyte equivale a 1024kB, y cada kilobyte equivale a 1024bytes
       5MB×1,048,576bytes/   MB=5,242,880bytes
       */

    const filesize = file.size / 1024/1024;
    if (filesize > this.maxFileSizeMB) {
      Swal.fire(
        'El archivo ' +
          file.name +
          ' excede el tamaño permitido para archivos .'
      );

    }
    return filesize <= this.maxFileSizeMB;
  }

  validarExtArchivo(file: File): boolean {
    // Obtener la extensión del archivo
    const ext = file.name.split('.').pop()?.toLowerCase();
    // Lista de extensiones permitidas
    const extensionesValidas = [
      'pdf',
      'zip',
      'rar',
      'tar',
      'doc',
      'docx',
      'xlsx',
      'xlsm',
      'csv',
      'txt',
      'kml',
      'kmz',
      'dwg',
    ];
    return extensionesValidas.includes(ext || '');
  }

  setValueEvidencia(
    event: Event | MatDatepickerInputEvent<Date>,
    type: string,
    indexFile: number,
    indexForm: number
  ) {
    let value = null;
    if (event instanceof MatDatepickerInputEvent) {
      value = new Date(event.value);
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      value = `${year}-${month}-${day}`;
    } else {
      value = (event.target as HTMLInputElement).value;
    }
    const dataEvidencia: DataEvidencia[] = this.filesCache[indexForm]['data'];

    switch (type) {
      case 'coorX':
        this.inputTouched = true;
        this.isDisabled = true;
        dataEvidencia[indexFile].coorX = value;
        dataEvidencia[indexFile].fechaFotoRequired = false;
        if (value && !dataEvidencia[indexFile].fechaFoto) {
          dataEvidencia[indexFile].fechaFotoRequired = true; // Campo adicional para validar si es requerido
        }
        break;
      case 'coorY':
        this.isDisabled = true;
        this.inputTouched = true;
        dataEvidencia[indexFile].coorY = value;
        break;
      case 'fechaFoto':
        this.inputTouched = true;
        dataEvidencia[indexFile].fechaFoto = value;

        if (value && dataEvidencia[indexFile].fechaFoto) {
          dataEvidencia[indexFile].fechaFotoRequired = false; // Campo adicional para validar si es requerido
        }

        if (value !== 0 || value !== null || value !== undefined) {
          this.inputTouched = false;
        }
        break;
      case 'niGradosLongitud':
        dataEvidencia[indexFile].niGradosLongitud = value;
        dataEvidencia[indexFile].fechaFotoRequired = false;
        this.inputTouched = true;
        this.isDisabled = true;

        if (value && !dataEvidencia[indexFile].fechaFoto) {
          dataEvidencia[indexFile].fechaFotoRequired = true; // Campo adicional para validar si es requerido
        }
        break;
      case 'niMinLongitud':
        dataEvidencia[indexFile].niMinLongitud = value;
        this.isDisabled = true;
        break;
      case 'niSegLongitud':
        dataEvidencia[indexFile].niSegLongitud = value;
        this.isDisabled = true;
        break;
      case 'niGradosLatitud':
        dataEvidencia[indexFile].latitud_grados = value;
        this.isDisabled = true;

        break;
      case 'niMinLatitud':
        dataEvidencia[indexFile].latitud_min = value;
        this.isDisabled = true;
        break;
      case 'niSegLatitud':
        dataEvidencia[indexFile].latitud_seg = value;
        this.isDisabled = true;
        break;
      case 'niSistemaCoordenada':
        dataEvidencia[indexFile].niSistemaCoordenada = value;
        break;
    }
  }

  nacionalValidar(indexFile, indexForm) {
    const dataEvidencia: DataEvidencia[] = this.filesCache[indexForm]['data'];
    let coorX = dataEvidencia[indexFile].coorX;
    let coorY = dataEvidencia[indexFile].coorY;
    let data: any = {
      niX: +coorX,
      niY: +coorY,
    };
    if (
      coorX !== null &&
      coorX !== undefined &&
      coorY !== null &&
      coorY !== undefined
    ) {
      this.expedienteService
        .validarCoorNac(data.niX, data.niY)
        .pipe(debounceTime(3000))
        .subscribe({
          next: ({ event, response }) => {
            if (response && event.type === HttpEventType.Response) {
              if (event.status === 400) {
                this.isDisabled = true;
                Swal.fire({
                  title:
                    'No fue posible verificar la información, error en el servidor',
                  icon: 'error',
                });
              }
            }
          },
          error: (error: HttpErrorResponse) => {
            let errorEditado = this.extraerMensajeError(error?.error['text']);
            this.mensajeNacional = errorEditado;
            this.isDisabled = true;
            if (error) {
              this.isDisabledN = true;
              Swal.fire({
                title: `${errorEditado}`,
                icon: 'error',
              });
            }
            if (this.mensajeNacional.includes('Coordenadas correctas')) {
              this.inputTouched = false;
              this.isDisabled = false;
              this.isDisabledN = false;
              Swal.fire({
                title: `${this.mensajeNacional}`,
                icon: 'success',
              });
            }
          },
        });
    }
  }

  geograficasValidar(indexFile, indexForm) {
    const dataEvidencia: DataEvidencia[] = this.filesCache[indexForm]['data'];
    let niGradosLongitud = dataEvidencia[indexFile].niGradosLongitud;
    let niMinLongitud = dataEvidencia[indexFile].niMinLongitud;
    let niSegLongitud = dataEvidencia[indexFile].niSegLongitud;
    let niGradosLatitud = dataEvidencia[indexFile].latitud_grados;
    let niMinLatitud = dataEvidencia[indexFile].latitud_min;
    let niSegLatitud = dataEvidencia[indexFile].latitud_seg;
    let data84 = {
      niGradosLongitud: dataEvidencia[indexFile].niGradosLongitud,
      niMinsLongitud: dataEvidencia[indexFile].niMinLongitud,
      niSegsLongitud: dataEvidencia[indexFile].niSegLongitud,
      niGradosLatitud: dataEvidencia[indexFile].latitud_grados,
      niMinsLatitud: dataEvidencia[indexFile].latitud_min,
      niSegsLatitud: dataEvidencia[indexFile].latitud_seg,
    };
    if (
      niGradosLongitud !== null &&
      niGradosLongitud !== undefined &&
      niMinLongitud !== null &&
      niMinLongitud !== undefined &&
      niSegLongitud !== null &&
      niSegLongitud !== undefined &&
      niGradosLatitud !== null &&
      niGradosLatitud !== undefined &&
      niMinLatitud !== null &&
      niMinLatitud !== undefined &&
      niSegLatitud !== null &&
      niSegLatitud !== undefined
    ) {
      this.expedienteService
        .validarCoordenadas84(
          data84.niGradosLongitud,
          data84.niMinsLongitud,
          data84.niSegsLongitud,
          data84.niGradosLatitud,
          data84.niMinsLatitud,
          data84.niSegsLatitud
        )
        .subscribe({
          next: ({ event, response }) => {
            if (response && event.type === HttpEventType.Response) {
              if (event.status === 400) {
                this.isDisabled = true;
                Swal.fire({
                  title:
                    'No fue posible verificar la información, error en el servidor',
                  icon: 'error',
                });
              }
            }
          },
          error: (error: HttpErrorResponse) => {
            let errorEditado = this.extraerMensajeError(error?.error['text']);
            this.mensajeGeo = errorEditado;
            this.isDisabled = true;
            if (error) {
              this.isDisabledG = true;
              Swal.fire({
                title: `${errorEditado}`,
                icon: 'error',
              });
            }
            if (errorEditado.includes('Coordenadas correctas')) {
              this.inputTouched = false;
              this.isDisabled = false;
              this.isDisabledG = false;

              Swal.fire({
                title: `${errorEditado}`,
                icon: 'success',
              });
            }
          },
        });
    }
  }

  extraerMensajeError(mensajeCompleto: string): string {
    if (
      mensajeCompleto.includes('ORA-') ||
      mensajeCompleto.includes('_SIRENA') ||
      mensajeCompleto.includes('--')
    ) {
      let otroMsg = mensajeCompleto?.split('ORA-') || [];
      let msgSirena = mensajeCompleto?.split('_SIRENA') || [];
      const inicioMensaje = mensajeCompleto?.split('--') || [];

      let mensajeUtil = otroMsg[0] || msgSirena[0] || inicioMensaje[0];

      return mensajeUtil ? mensajeUtil.trim() : null;
    }
    const inicioMensaje = mensajeCompleto?.split('--') || [];
    const mensajeUtil = inicioMensaje[0];

    return mensajeUtil ? mensajeUtil.trim() : null;
  }

  async deletedFile(indexForm: number, indexFile: number, fileName?: string) {
    await Swal.fire({
      title: '¿Desea Eliminar este archivo?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Eliminar`,
    }).then((result) => {
      if (result.isConfirmed) {
        // this.noTieneDatos = true;
        const sequenceThirdParty = JSON.parse(
          localStorage.getItem('sec')
        ).sequenceThirdParty;
        const sequenceThirdParty2 = JSON.parse(
          localStorage.getItem('expediente')
        ).sequenceThirdParty2;
        this.inputTouched = false;
        this.isDisabled = false;
        const formGroupByIndexForm: FormGroup = this.obligacionesFormArray
          .controls[indexForm] as FormGroup;
        const formAndFilesByIndexForm: FormAndFiles = this.formAndFiles.find(
          (item) => item.indexForm === indexForm
        );

        const niLineaObligacion = formGroupByIndexForm.controls.line.value;
        if (niLineaObligacion) {
          var dataEvidence: DataEvidencia =
            formAndFilesByIndexForm.data[indexFile];
          if (dataEvidence?.niNroArchivo) {
            const params = {
              niLineaObligacion,
              niNroArchivo: dataEvidence.niNroArchivo,
              sequenceThirdParty,
              sequenceThirdParty2,
              nombreArchivo: dataEvidence.file.name,
            };

            const paramsZip = {
              niLineaObligacion,
              niNroArchivo: dataEvidence.niNroArchivo,
              nombreArchivo: dataEvidence.file.name.split('/')[4],
              expediente: this.expediente,
              agno:localStorage.getItem('agno')
            };


            //console.log(paramsZip)
            //console.log( dataEvidence.file.name)
            //console.log( dataEvidence.file.name.split("/"))

            if(dataEvidence.file.name.split("/").length > 2){
              this.expedienteService.eliminarZip(paramsZip).subscribe();
              formAndFilesByIndexForm.data.splice(indexFile, 1);
              this.inputTouched = false;
              this.isDisabled = false;

              const paramsNameBD = {
                niLineaObligacion,
                niNroArchivo: dataEvidence.niNroArchivo,
                sequenceThirdParty,
                sequenceThirdParty2,
                nombreArchivo: dataEvidence.file.name.split('/')
              };

              this.expedienteService.eliminarArchivos(paramsNameBD).subscribe((nameDel)=>{

                //console.log(nameDel)
              })


            }else {  this.expedienteService.eliminarArchivos(params).subscribe(
                (data) => {
                  formAndFilesByIndexForm.data.splice(indexFile, 1);
                  this.niSistemaCoordenada = null;
                  this.inputTouched = false;
                  this.isDisabled = false;
                  this.fileList.splice(indexFile, 1);
                  this.WSG84_SELECTED[indexFile] = null;
                  this.ORIGEN_UNICO_SELECTED[indexFile] = null;
                  //this.noTieneDatos = false;
                },
                (ex: HttpErrorResponse) => {
                  console.warn(
                    'No se pudo eliminar el archivo\n' + JSON.stringify(ex)
                  );
                }
              );
            }



            if (dataEvidence.niNroArchivo == undefined) {
              this.inputTouched = false;
              this.isDisabled = false;
              formAndFilesByIndexForm.data.splice(indexFile, 1);
              // delete file from FileList
              this.fileList.splice(indexFile, 1);
              // this.noTieneDatos = false;
            }
          } else {
            // dataEvidence.file.slice(0,1)inputFileEvidenciaf
            formAndFilesByIndexForm.data.splice(indexFile, 1);
            this.filesCache[indexForm]?.data.splice(indexFile, 1);
            this.inputTouched = false;
            this.isDisabled = false;
            this.fileList.splice(indexFile, 1);
            // this.noTieneDatos = false;
          }
        } else {
          formAndFilesByIndexForm.data.splice(indexFile, 1);
          this.fileList.splice(indexFile, 1);
          this.inputTouched = false;
          this.isDisabled = false;
        }
      }
    });
  }

  /*  filesByFormIndexList(indexForm): DataEvidencia[] {
    const formAndFile: FormAndFiles = this.formAndFiles.find(
      (item) => item.indexForm === indexForm
    );
    this.filesCache[indexForm] =
      formAndFile && formAndFile.data ? formAndFile.data : [];
    return this.filesCache[indexForm];
  }
 */
  onFormFilesChange(indexForm: number): void {
    this.filesCache[indexForm] = null;
  }

  obligaByFormList(indexForm): any {
    const formAndFile: FormAndFiles = this.formAndFiles.find(
      (item) => item.indexForm === indexForm
    );
    this.imgCache[indexForm] =
      formAndFile && formAndFile.data
        ? [{ estado: formAndFile.comoTermina }, formAndFile.data]
        : [];

    return this.imgCache[indexForm];
  }

  onFormImgChange(indexForm: number): void {
    this.imgCache[indexForm] = null;
  }

  checkValidImgs(indexForm: number): boolean {
    if (
      this.filesCache !== undefined ||
      (Array.isArray(this.filesCache) && this.filesCache.length > 0)
    ) {
      const formAndFile = this.filesCache[indexForm]?.['data']
        ? this.filesCache[indexForm]?.['data']
        : [];

      return formAndFile?.some((evidencia) => {
        const fileNameImg = evidencia?.file?.name || '';
        return /\.(jpg|jpeg|png)$/i.test(fileNameImg);
      });
    }

    return false;
  }

  public expedienteUrl(): void {
    this.activeRoute.params.subscribe((expediente: any) => {
      this.expediente = expediente.expediente;
    });
  }
  public getDataLocalStorage(): void {
    const data = JSON.parse(localStorage.getItem('sec'));
    const radicado_R = JSON.parse(localStorage.getItem('radicadoR'));
    this.radicadoR = radicado_R.toString();
    this.sec = data;
    this.secuenciaTercero = data.sequenceThirdParty;
    this.expedienteService
      .getListaExpedientes(data.sequenceThirdParty)
      .subscribe((datas: ListaExpedientes) => {
        if (datas.result) {
          datas.lista_expedientes.find((value) => {
            if (value.expediente === this.expediente) {
              this.listaExpediente = value;
              const newResolucion = {
                sequenceThirdParty2: value.exp_sec.toString(),
              };
              var expedienteActual = value.expediente;
              sessionStorage.setItem('exA', JSON.stringify(expedienteActual));

              localStorage.setItem('expediente', JSON.stringify(newResolucion));
              this.expe = newResolucion.sequenceThirdParty2;
            }
          });
        }
      });
  }

  changee(event: MatRadioChange, indexForm: number) {

    if (event.source.checked) {
      var coordenada = '0';
      if (event.value === '4326') {
        // Actualiza el valor del sistema de coordenadas para este formulario específico
        this.formObligaciones.controls['obligaciones']['controls'][
          indexForm
        ]?.controls['sistema_coordenadas'].setValue(4326);

        // Actualiza el estado para este formulario específico en los arrays
        this.WSG84_SELECTED[indexForm] = true;
        this.ORIGEN_UNICO_SELECTED[indexForm] = false;

        this.niSistemaCoordenada = 4326;

        coordenada = String(SistemaCoordenada.WGS84);
        Swal.fire({
          title:
            'Seleccionaste coordenadas geográficas: Ingresa las coordenadas, así.\n Longitud: -74 25 35   Latitud: 6 25 6 ',
          confirmButtonText: 'Continuar!',
          showClass: {
            popup: 'animate__animated animate__fadeInDown',
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
          },
        });
      }

      if (event.value === '9377') {
        this.formObligaciones.controls['obligaciones']['controls'][
          indexForm
        ]?.controls['sistema_coordenadas'].setValue(9377);

        // Actualiza el estado para este formulario específico en los arrays
        this.WSG84_SELECTED[indexForm] = false;
        this.ORIGEN_UNICO_SELECTED[indexForm] = true;

        this.niSistemaCoordenada = 9377;

        coordenada = String(SistemaCoordenada.ORIGEN_UNICO);
        Swal.fire({
          title:
            'Seleccionaste coordenadas Origen Único: Ingresa los valores, sin puntos ni comas.\n  X: 4700000  Y:2179000',
          confirmButtonText: 'Continuar!',
          showClass: {
            popup: 'animate__animated animate__fadeInDown',
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
          },
        });
      }

      sessionStorage.setItem('coor', JSON.stringify(coordenada));
    }
  }

  changeEstado(event: MatRadioChange, indexForm, control) {
    let opuesto = control == 'parcial' ? 'total' : 'parcial';
    if (event.source.checked) {
      if (event.value === 'P') {
        this.comoTermina = 'P';
      }
      if (event.value === 'T') {
        this.comoTermina = 'T';
      }
    }
  }

  async saveObligation(indexForm: number) {
    const obligacionValue: ObligacionValue =
      this.obligacionesFormArray.controls[indexForm].value;

    if (obligacionValue?.viMotivoParcial?.length > 5) {
      this.comoTermina = 'P';
    }

    if (
      obligacionValue?.viMotivoParcial?.length <= 3 &&
      this.comoTermina === 'T'
    ) {
      obligacionValue.viMotivoParcial = '';
      this.comoTermina = 'T';
    }

    const guardarObligacion: GuardarObligacionRequest = {
      observaciones: obligacionValue.observaciones,
      secResol: this.radicadoR,
      descripcion: obligacionValue.descripcion,
      viMotivoParcial: obligacionValue.viMotivoParcial,
      nioLinea: +obligacionValue.line,
      sequenceThirdParty: Number(this.secuenciaTercero),
      sequenceThirdParty2: Number(this.expe),
      comoTermina: this.comoTermina,
    };

    await Swal.fire({
      title: 'Desea Guardar cambios?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Guardar`,
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.filesCache !== undefined) {
          if (this.inputTouched) {
            Swal.fire({
              title: 'Tienes campos con errores.',
              text: 'Revisa los campos de coordenadas y fecha.',
              icon: 'info',
              timer: 3000,
            });
          } else {
            this.expedienteService
              .postGuardarObligacion(guardarObligacion)
              .subscribe((obligacionResponse: GuardarObligacionResponse) => {
                const formGroup: FormGroup = this.obligacionesFormArray
                  .controls[indexForm] as FormGroup;
                formGroup.controls.line.setValue(obligacionResponse.line);

                if (obligacionResponse.result) {
                  Swal.fire({
                    title: 'Obligación guardada',
                    icon: 'success',
                    timer: 3000,
                  });
                  this.evento.emit(false);
                  const formAndFile: FormAndFiles = this.formAndFiles.find(
                    (item) => item.indexForm === indexForm
                  );

                  if (
                    formAndFile &&
                    formAndFile.data &&
                    formAndFile.data.length
                  ) {
                  }
                  //TODO: Validar que files exista
                  let ultimo = formAndFile.data.length - 1;
                  let contador = 0;

                  if (ultimo == 0) {
                  }

                  from(formAndFile.data || [])
                    .pipe(
                      concatMap((dataEvidencia: DataEvidencia) => {
                        if (
                          !this.isDisabled &&
                            !this.inputTouched &&
                            dataEvidencia.fechaFoto !== undefined ||
                            dataEvidencia?.fechaFoto?.length > 0   ||
                            dataEvidencia.fechaFoto !== null && !dataEvidencia.fechaFotoRequired
                        ) {
                          if (!dataEvidencia.file?.name) {

                            return EMPTY;
                          }

                          const expediente = JSON.parse(sessionStorage.getItem('exA') || '{}' );
                          let creacionAut = localStorage.getItem('agno') != null ? localStorage.getItem('agno') : null
                          const fileData = new FormData();
                          fileData.append('sequenceThirdParty2', this.expe);
                          fileData.append(
                            'sequenceThirdParty',
                            this.secuenciaTercero
                          );
                          fileData.append('line', obligacionResponse.line);
                          fileData.append('file', dataEvidencia.file);
                          fileData.append(
                            'viUbicacionArchivo',
                            dataEvidencia.viUbicacionArchivo
                          );
                          fileData.append(
                            'coorX',
                            dataEvidencia.coorX
                              ? String(dataEvidencia.coorX)
                              : '0'
                          );
                          fileData.append(
                            'coorY',
                            dataEvidencia.coorY
                              ? String(dataEvidencia.coorY)
                              : '0'
                          );

                          if (dataEvidencia.coorX > 1) {
                            fileData.append(
                              'niSistemaCoordenada',
                              String(9377)
                            );
                          }
                          if (dataEvidencia.niMinLongitud > 1) {
                            fileData.append(
                              'niSistemaCoordenada',
                              String(4326)
                            );
                          }

                          fileData.append(
                            'niGradosLongitud',
                            dataEvidencia.niGradosLongitud
                              ? String(dataEvidencia.niGradosLongitud)
                              : '0'
                          );
                          fileData.append(
                            'niMinLongitud',
                            dataEvidencia.niMinLongitud
                              ? String(dataEvidencia.niMinLongitud)
                              : '0'
                          );
                          fileData.append(
                            'niSegLongitud',
                            dataEvidencia.niSegLongitud
                              ? String(dataEvidencia.niSegLongitud)
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
                          fileData.append('expediente', expediente);
                          fileData.append('agno_mes', creacionAut);


                          return this.expedienteService
                            .postGuardarArchivo(fileData)
                            .pipe(
                              catchError((error) => {
                                if(error.status == 400){
                                  Swal.fire({
                                    title:
                                      'No fue posible guardar el archivo.',
                                    text: `Error:Servidor no disponible`,
                                    icon: 'warning',
                                    timer: 6000,
                                  });
                                }
                                if (
                                  error?.error['text'].includes('duplicados') ||
                                  error?.error['text'].includes('Si la úbicación del archivo es DB')
                                ) {
                                  this.fileStatus.status = '';
                                  return EMPTY;

                                  /* msj no guardo */
                                } else {
                                  this.fileStatus.status = '';

                                  console.error(
                                    'Error al guardar archivo:',
                                    error?.error['text']
                                  );
                                  Swal.fire({
                                    title:
                                      'No fue posible guardar el archivo. Continuando con los siguientes.',
                                    text: `Error: ${error?.error['text']}`,
                                    icon: 'warning',
                                    timer: 6000,
                                  });
                                  return EMPTY;
                                }


                              })
                            );
                        } else {
                          Swal.fire({
                            title: 'Coordenadas sin validar o sin fecha.',
                            text: 'Las coordenadas ingresadas, no son correctas, es obligatorio que pasen la validación.',
                            icon: 'warning',
                            timer: 3000,
                          });

                          return null;
                        }
                      })
                    )
                    .subscribe({
                      next: ({ event, response }) => {

                        if(response === undefined){
                          this.expedienteService.show();
                        }
                        if (response && event.type === HttpEventType.Response) {

                          if (
                            event.status === 200 &&
                            typeof response?.valueOf() === 'number'
                          ) {
                            this.loadObligationsAndFiles();
                            this.fileStatus.status = 'done';
                            this.reset();

                          }

                          if (
                            event.status === 400 &&
                            typeof response?.valueOf() !== 'number'
                          ) {
                            Swal.fire({
                              title:
                                'No fue posible guardar el archivo, verifique la información',
                              icon: 'error',
                            });
                          }
                        }

                        if (event.type === HttpEventType.UploadProgress) {
                          this.uploadSub = true;
                          this.updateStatus(
                            event.loaded,
                            event.total!,
                            'Cargando... '
                          );
                        }else{
                          this.fileStatus.status = '';
                        }
                      },
                      error: (error: HttpErrorResponse) => {
                        if (
                          error?.error?.['text'].includes('duplicados') ||
                          error?.error?.['text'].includes(
                            'Si la úbicación del archivo es DB'
                          )
                        ) {
                          this.fileStatus.status = '';
                        } else {
                          this.fileStatus.status = '';
                          let otrosError = error?.error?.['text'];
                          this.extraerMensajeError(otrosError);
                          Swal.fire({
                            title:
                              'No fue posible guardar el archivo, verifiqué la información.' +
                              `${otrosError}`,
                            icon: 'error',
                          });
                        }
                      },
                    });
                }
              });
          }
        } else {
          this.expedienteService
            .postGuardarObligacion(guardarObligacion)
            .subscribe((obligacionResponse: GuardarObligacionResponse) => {
              const formGroup: FormGroup = this.obligacionesFormArray.controls[
                indexForm
              ] as FormGroup;
              formGroup.controls.line.setValue(obligacionResponse.line);

              if (obligacionResponse.result) {
                Swal.fire({
                  title: 'Obligación guardada',
                  icon: 'success',
                  timer: 3000,
                });
                this.evento.emit(false);
                const formAndFile: FormAndFiles = this.formAndFiles.find(
                  (item) => item.indexForm === indexForm
                );

                if (
                  formAndFile &&
                  formAndFile.data &&
                  formAndFile.data.length
                ) {
                }
                //TODO: Validar que files exista
                let ultimo = formAndFile.data.length - 1;
                let contador = 0;

                if (ultimo == 0) {
                }


                from(formAndFile.data || [])
                .pipe(
                  concatMap((dataEvidencia: DataEvidencia) => {
                    if (
                      !this.isDisabled &&
                        !this.inputTouched &&
                        dataEvidencia.fechaFoto !== undefined ||
                        dataEvidencia?.fechaFoto?.length > 0   ||
                        dataEvidencia.fechaFoto !== null && !dataEvidencia.fechaFotoRequired
                    ) {
                      if (!dataEvidencia.file?.name) {
                        Swal.fire({
                          title: 'Obligación guardada',
                          icon: 'success',
                          timer: 3000,
                        });
                        return EMPTY;
                      }

                      const expediente = JSON.parse(
                        sessionStorage.getItem('exA') || '{}'
                      );
                      const fileData = new FormData();
                      fileData.append('sequenceThirdParty2', this.expe);
                      fileData.append(
                        'sequenceThirdParty',
                        this.secuenciaTercero
                      );
                      fileData.append('line', obligacionResponse.line);
                      fileData.append('file', dataEvidencia.file);
                      fileData.append(
                        'viUbicacionArchivo',
                        dataEvidencia.viUbicacionArchivo
                      );
                      fileData.append(
                        'coorX',
                        dataEvidencia.coorX
                          ? String(dataEvidencia.coorX)
                          : '0'
                      );
                      fileData.append(
                        'coorY',
                        dataEvidencia.coorY
                          ? String(dataEvidencia.coorY)
                          : '0'
                      );

                      if (dataEvidencia.coorX > 1) {
                        fileData.append(
                          'niSistemaCoordenada',
                          String(9377)
                        );
                      }
                      if (dataEvidencia.niMinLongitud > 1) {
                        fileData.append(
                          'niSistemaCoordenada',
                          String(4326)
                        );
                      }

                      fileData.append(
                        'niGradosLongitud',
                        dataEvidencia.niGradosLongitud
                          ? String(dataEvidencia.niGradosLongitud)
                          : '0'
                      );
                      fileData.append(
                        'niMinLongitud',
                        dataEvidencia.niMinLongitud
                          ? String(dataEvidencia.niMinLongitud)
                          : '0'
                      );
                      fileData.append(
                        'niSegLongitud',
                        dataEvidencia.niSegLongitud
                          ? String(dataEvidencia.niSegLongitud)
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
                      fileData.append('expediente', expediente);

                      return this.expedienteService
                        .postGuardarArchivo(fileData)
                        .pipe(
                          catchError((error) => {
                            if(error.status == 400){
                              Swal.fire({
                                title:
                                  'No fue posible guardar el archivo.',
                                text: `Error:Servidor no disponible`,
                                icon: 'warning',
                                timer: 6000,
                              });
                            }
                            if (
                              error?.error['text'].includes('duplicados') ||
                              error?.error['text'].includes(
                                'Si la úbicación del archivo es DB'
                              )
                            ) {
                              this.fileStatus.status = '';
                              return EMPTY;
                            } else {
                              this.fileStatus.status = '';

                              console.error(
                                'Error al guardar archivo:',
                                error?.error['text']
                              );
                              Swal.fire({
                                title:
                                  'No fue posible guardar el archivo. Continuando con los siguientes.',
                                text: `Error: ${error?.error['text']}`,
                                icon: 'warning',
                                timer: 6000,
                              });
                              return EMPTY;
                            }
                          })
                        );
                    } else {
                      Swal.fire({
                        title: 'Coordenadas sin validar o sin fecha.',
                        text: 'Las coordenadas ingresadas, no son correctas, es obligatorio que pasen la validación.',
                        icon: 'warning',
                        timer: 3000,
                      });

                      return null;
                    }
                  })
                )
                .subscribe({
                  next: ({ event, response }) => {

                    if (response && event.type === HttpEventType.Response) {
                      if (
                        event.status === 200 &&
                        typeof response?.valueOf() === 'number'
                         ) {
                        this.loadObligationsAndFiles();
                        this.fileStatus.status = 'done';
                        this.reset();
                      }
                      if (
                        event.status === 400 &&
                        typeof response?.valueOf() !== 'number'
                      ) {
                        Swal.fire({
                          title:
                            'No fue posible guardar el archivo, verifique la información',
                          icon: 'error',
                        });
                      }
                    }

                    if (event.type === HttpEventType.UploadProgress) {
                      this.uploadSub = true;
                      this.updateStatus(
                        event.loaded,
                        event.total!,
                        'Cargando... '
                      );
                    }else{
                      this.fileStatus.status = '';

                    }
                  },
                  error: (error: HttpErrorResponse) => {
                    if (
                      error?.error?.['text'].includes('duplicados') ||
                      error?.error?.['text'].includes(
                        'Si la úbicación del archivo es DB'
                      )
                    ) {
                      this.fileStatus.status = '';
                    } else {
                      this.fileStatus.status = '';
                      let otrosError = error?.error?.['text'];
                      this.extraerMensajeError(otrosError);
                      Swal.fire({
                        title:
                          'No fue posible guardar el archivo, verifiqué la información.' +
                          `${otrosError}`,
                        icon: 'error',
                      });
                    }
                  },
                });
              }
            });
        }

        sessionStorage.removeItem('coor');
      } else if (result.isDenied) {
        Swal.fire('No guardar cambios', '', 'info');
      }
    });
  }



  private updateStatus(
    loaded: number,
    total: number,
    requestType: string
  ): void {
    this.fileStatus.status = 'progress';
    this.fileStatus.requestType = requestType;
    this.fileStatus.percent = Math.round((100 * loaded) / total);


    if( this.fileStatus.percent === 100 &&  this.fileStatus.status === 'progress'){

      this.fileStatus.requestType  = 'Este proceso tardara unos segundos más.'
    }
  }

  async crearObligacion(indexForm: number) {
    this.loadOblig = false;
    const obligacionValue: ObligacionValue =
      this.obligacionesFormArray.controls[indexForm].value;

    if (
      !sessionStorage.getItem('coor') ||
      sessionStorage.getItem('coor') === null
    ) {
      sessionStorage.setItem('file', '0');
      var data = sessionStorage.getItem('file');
    } else {
      var data = sessionStorage.getItem('coor');
    }

    const guardarObligacion: GuardarObligacionRequest = {
      observaciones: obligacionValue.observaciones,
      secResol: this.radicadoR,
      descripcion: obligacionValue.descripcion,
      viMotivoParcial: obligacionValue.viMotivoParcial,
      nioLinea: +obligacionValue.line,
      sequenceThirdParty: Number(this.secuenciaTercero),
      sequenceThirdParty2: Number(this.expe),
      comoTermina: this.comoTermina,
    };

    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
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
        } else {
          console.log('obligación sin guardar');
        }
      });
    sessionStorage.removeItem('coor');
    Swal.fire('Transcipción guardada!', '', 'success');
  }

  public siguientePrimero(): void {
    this.siguientePrimeroOut.emit(true);
    this.actualiza.emit(true);
  }
  public atrasPrimero(): void {
    this.atrasPrimeroOut.emit(this.atras);
  }

  private reset() {
    this.uploadProgress = 0;
    this.noTieneDatos = false;
    this.uploadSub = false;
    this.evento.emit(false);
    Swal.fire({
      title: 'Guardado con exito',
      showConfirmButton: false,
      icon: 'success',
      timer: 2000,
    });
  }
}
