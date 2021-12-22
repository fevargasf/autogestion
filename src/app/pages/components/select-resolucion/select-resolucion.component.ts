import { Component, ElementRef, EventEmitter, OnInit, Output, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { ExpedienteService } from 'src/app/core/services/expediente.service';
import { Archivos } from 'src/app/pages/components/interfaces/archivos';
import { ListaExpedientes } from 'src/app/pages/components/interfaces/lista_expedientes.interface';
import { Obligaciones } from 'src/app/pages/components/interfaces/obligaciones.interface';
import { Resolucion } from 'src/app/pages/components/interfaces/resolucion.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-select-resolucion',
  templateUrl: './select-resolucion.component.html',
  styleUrls: ['./select-resolucion.component.scss']
})
export class SelectResolucionComponent implements OnInit {
  @ViewChild('inputFile') inputFile: ElementRef;
  public nombreArchivo: string;
  public nombreObligacion: string;
  public ocultarObligacion = true;
  public valueArchivo: string;
  @Output() seleccionResolucion = new EventEmitter<any>();
  @Output() siguientePrimeroOut = new EventEmitter<any>();
  @Input() expedienteInput:  ListaExpedientes;
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
  public pdfSrc =
    'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  public sec: string;
  public secuenciaTercero: string;
  public expe: string;
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
  constructor(
    private activeRoute: ActivatedRoute,
    private expedienteService: ExpedienteService,
    private fb: FormBuilder,
    private stepper: MatStepper
  ) {
    this.resoluciones = [];
    this.obligaciones = [];
    this.archivos = [];
  }

  ngOnInit(): void {
    this.expedienteUrl();
    this.getDataLocalStorage();
    this.dataBuilder();
  }

  seleccionarResolucion(resolucion){
    this.seleccionResolucion.emit(resolucion);
  }

  public cargar(val: any): void {
    this.nombreArchivo = val.files[0].name;
    this.valueArchivo = val.value;
    if (this.valueArchivo === '') {
      this.visualizarBtn = false;
    } else {
      this.visualizarBtn = true;
    }
  }

  public deleteAdj(checbox): void {
    if (checbox) {
      this.nombreArchivo = '';
    }
  }

  public siguientePrimero(): void {
    this.siguientePrimeroOut.emit(true);
    Swal.fire({
      title:
        '¿Está seguro que desea adjuntar esta información?, Al dar clic en aceptar no podrá regresar a adjuntar obligaciones?',
      icon: 'question',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.stepper.next();
      } else {
      }
    });
  }

  public anadirObligaciones(): void {
    this.contador += 1;
    this.addObligacionArray.push(this.addObligacion());
    this.ocultarObligacion = false;
    this.ocultarbotones = false;
  }

  public expedienteUrl(): void {
    this.activeRoute.params.subscribe((expediente: any) => {
      this.expediente = expediente.expediente;
    });
  }

  public getDataLocalStorage(): void {
    const data = JSON.parse(localStorage.getItem('sec'));
    this.sec = data;
    this.secuenciaTercero = data.sequenceThirdParty;
    this.expedienteService.getListaExpedientes(data.sequenceThirdParty).subscribe((datas) => {
        if (datas.result) {
          datas.lista_expedientes.filter((value) => {            
            if (value.expediente === this.expediente) {
              const newResolucion = {
                sequenceThirdParty2: value.exp_sec.toString(),
              };
              localStorage.setItem('expediente', JSON.stringify(newResolucion));
              const responsable = JSON.parse(localStorage.getItem('responsable'));
          
              responsable.sequenceThirdParty2 = JSON.stringify(value.exp_sec);

             

              localStorage.setItem('responsable', JSON.stringify(responsable));
              this.expedienteService.guardarInformacionResponsable(responsable).subscribe(res => {
              }, err => {
                console.log(err);
              });
              this.expe = newResolucion.sequenceThirdParty2;
              this.expedienteService.postObtenerResolucion(newResolucion.sequenceThirdParty2).subscribe((dataRe) => {
                  if (dataRe.resoluciones) {
                    this.resoluciones = dataRe.resoluciones;
                    
                    this.isLoading = false;
                    // tslint:disable-next-line:radix
                    this.consultaObligacion(
                      // tslint:disable-next-line:radix
                      parseInt(newResolucion.sequenceThirdParty2),
                      // tslint:disable-next-line:radix
                      parseInt(this.secuenciaTercero)
                    );
                  }
                });
            }
          });
        }
      });
    // this.postExpediente(data.id);
  }


  public guardarObligacion(form, i): void {
    const {nombre_obligacion, observaciones, documentos, descripcion} = this.formulario.value.contenido[i];

    const tamResoluciones = this.resoluciones.length-1;
    this.secR = this.resoluciones[tamResoluciones].expe_sec;
  
    const obligacion = {
      observation: observaciones,
      description: descripcion,
      secResol: this.secR,
      sequenceThirdParty2: +this.expe,
      sequenceThirdParty: +this.secuenciaTercero,
     // line: null
    };

    this.dataObligaciones.push(obligacion);
    localStorage.setItem(
      'dataObligacion',
      JSON.stringify(this.dataObligaciones)
    );
    this.expedienteService.dataObligacion(this.dataObligaciones);

    this.expedienteService.postGuardarObligacion(obligacion).subscribe(data => {
      if (data.result) {
        this.guardoObligaciones = true;
      } else {
        this.guardoObligaciones = false;
      }

      this.ocultarObligacion = false;
      this.ocultarbotones = true;
      const tamFormulario = this.formulario.value.contenido.length - 1;
      this.nombreObligacion = this.formulario.value.contenido[tamFormulario].nombre_obligacion;

      const bodyObligations = {
        sequenceThirdParty2: +this.expe,
        sequenceThirdParty: +this.secuenciaTercero,
      };

      this.expedienteService.getConsultarObligacion$(bodyObligations).subscribe(data => {
        const obligaciones = data.obligations ? data.obligations : [];
        let line = 0;
        obligaciones.forEach(obligacion => {
          if (obligacion.line > line) {
            line = obligacion.line; 
          }
        });

        documentos.forEach(file => {
          const fileData = new FormData();
          fileData.append('sequenceThirdParty2', this.expe);
          fileData.append('sequenceThirdParty', this.secuenciaTercero);
          fileData.append('line', String(line));
          fileData.append('file', file);
          this.expedienteService.postGuardarArchivo(fileData).subscribe(res => {
          }, error => {
            console.log(error)
          });
        });
      }, error => {
        console.log(error)
      });
    }, err => {
      console.log(err);
    });
  }

  public dataBuilder(): void {
    this.formulario = this.fb.group({
      contenido: this.fb.array([this.addObligacion()]),
    });
  }

  public addObligacion(): FormGroup {
    return this.fb.group({
      nombre_obligacion: ['', Validators.required],
      documentos: [[], Validators.required],
      observaciones: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }

  public createItem(data): FormGroup {
    return this.fb.group(data);
  }

  public detectFiles(event): void {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.photos.push(
            this.createItem({
              file: ['', Validators.required],
              url: [e.target.result, Validators.required],
            })
          );
          this.photos.controls.map((val) => {
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }

  public eliminaArchivos(i): void {
    this.photos.removeAt(i);
  }

  get photos(): FormArray {
    return this.formulario.get('documentos') as FormArray;
  }

  get addObligacionArray(): FormArray {
    return this.formulario.get('contenido') as FormArray;
  }

  public visualizar(): void {
    this.mostrarContenido = true;
    this.addObligacionArray.push(this.addObligacion());
    this.addObligacionArray.removeAt(1);
  }

  public cargarObligacion(data): void {
  }

  public maximizar(i): void {
    this.contador = i;
    this.ocultarbotones = false;
  }

  public eliminarObligacion(i): void {
    this.addObligacionArray.removeAt(i);
  }

  public guardarTodasObligaciones(form): void {
    if (this.guardoObligaciones) {
      Swal.fire({
        title: `Obligaciones guardadas correctamente`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
      this.expedienteService.postGuardarArchivo(this.dataDelArchivo).subscribe(
        (archivo: any) => {
          if (archivo.result) {
          } else {
            alert('No Archivo');
          }
        },
        (err) => {
          // console.log('ERROR DEL SERVIDOR', err);
        }
      );
      this.isSiguiente = false;

      // tslint:disable-next-line:radix
      this.consultaObligacion(
        // tslint:disable-next-line:radix
        parseInt(this.expe),
        // tslint:disable-next-line:radix
        parseInt(this.secuenciaTercero)
      );
    } else {
      Swal.fire({
        title: `El limite de Obligaciones para guardar en BD de pruebas es de 9`,
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  }

  public consultaObligacion(expe, secuenciaTercero): void {
    const {documentos} = this.formulario.value.contenido[0];
    const obligacion = {
      // tslint:disable-next-line:radix
      sequenceThirdParty2: parseInt(expe),
      // tslint:disable-next-line:radix
      sequenceThirdParty: parseInt(secuenciaTercero),
    };
    this.dataObligacion = obligacion;
    // tslint:disable-next-line:radix
    this.expedienteService
      .getConsultarObligacion$(obligacion)
      .subscribe((data) => {
        if (data.result) {
          this.obligaciones = data.obligations;
          this.isLoading2 = false;
         
          this.obligaciones.map((datas) => {
            this.lineR = datas.niLinea;
          });
       
        }
      });
  }



  public getFilesNames(obligacion): Array<string> {
    const files = obligacion.get('documentos').value
    return files.map(file => file.name);
  }

  public eliminarArchivo(obligacionIndex, fileIndex): void {
    const {nombre_obligacion, observaciones, documentos, descripcion} =
      this.formulario.value.contenido[obligacionIndex];
    documentos.splice(fileIndex, 1)
    
    this.addObligacionArray.controls[obligacionIndex].setValue(
    {
      documentos,
      nombre_obligacion,
      observaciones,
      descripcion
    });
  }

  public onFileSelect(event, index): void {
    if (event.target.files.length > 0) {
      const {nombre_obligacion, observaciones, documentos, descripcion} = this.formulario.value.contenido[index];
      const file = event.target.files[0];
      documentos.push(file)
    
      this.addObligacionArray.controls[index].setValue(
      {
        documentos,
        nombre_obligacion,
        observaciones,
        descripcion
      });
    }
    this.inputFile.nativeElement.value = '';
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


  /* public consultaArchivos(): void {
    const consultaArchivo = {
      // tslint:disable-next-line:radix
      sequenceThirdParty2: parseInt(this.expe),
      // tslint:disable-next-line:radix
      sequenceThirdParty: parseInt(this.secuenciaTercero),
    };

    this.expedienteService
      .consultaArchivo(consultaArchivo)
      .subscribe((resulta) => {
        if (resulta.result) {
          this.archivos = resulta.archivos;
          this.isLoading3 = false;
        }
      });
  } */

 
}
