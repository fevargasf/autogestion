
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
import { ObligacionValue } from 'src/app/pages/components/interfaces/obligacion-value';
import { GuardarObligacionRequest } from 'src/app/pages/components/interfaces/guardar-obligacion-request';
import { GuardarObligacionResponse } from 'src/app/pages/components/interfaces/guardar-obligacion-response';
export interface FormAndFiles {
  indexForm: number;
  files: File[];
}
@Component({
  selector: 'app-listas-tablas',
  templateUrl: './listas-tablas.component.html',
  styleUrls: ['./listas-tablas.component.scss']
})
export class ListasTablasComponent implements OnInit {
  @Output() atrasPrimeroOut = new EventEmitter<any>();
  @Output() siguientePrimeroOut = new EventEmitter<any>();
  @Output() seleccionObligacion = new EventEmitter<any>();
  public resoluciones: Resolucion[] = [];
  public archivos: Archivos[] = [];
  public obligaciones: Obligaciones[];
  public isLoading = true;
  public sec: string;
  public secuenciaTercero: string;
  public expediente: any;
  public formulario: FormGroup;
  public lineR: number;
  public dataObligacion: object;
  public isLoading2 = true;
  public isLoading3 = true;
  public radicadoR: number;
  public atras = true;
  public siguiente = true;
  public isEditable1 = false;
          page = 1;
          pageSize = 4;
          collectionSize = 0;
          countries: Archivos[];
          formObligaciones: FormGroup;
          formAndFiles: FormAndFiles[] = [];
          expansionPanelIndex = 0;
  constructor(
    private activeRoute: ActivatedRoute,
    private expedienteService: ExpedienteService,
    private fb: FormBuilder,
    private stepper: MatStepper,
    
  ) { 
    this.resoluciones = [];
    this.obligaciones = [];
    this.archivos = [];
    this.formObligaciones = this.fb.group({
      obligaciones: this.fb.array([this.formGroup()])
    });

    this.formAndFiles.push({
      indexForm: 0, files: []
    });
  }

  ngOnInit(): void {

    this.expedienteUrl();
    this.getDataLocalStorage();
    this.dataBuilder();
    this.consultaObligacion();
    
  }

  get obligacionesFormArray() {
    return this.formObligaciones.controls["obligaciones"] as FormArray;
  }
  get addObligacionArray(): FormArray {
    return this.formulario.get('contenido') as FormArray;
  }
  formGroup() :FormGroup {
    return this.fb.group({
      nombreObligacion: [],
      descripcion: [],
      observaciones: [],
      coorX: [],
      coorY: [],
      fechaFoto: [],
      line: null,
    });
  }

  seleccionarLista(obligaciones){
    this.seleccionObligacion.emit(obligaciones);
  }
  public expedienteUrl(): void {
    this.activeRoute.params.subscribe((expediente: any) => {
      // console.log(expediente.expediente);
      this.expediente = expediente.expediente;
    });
  }
  public getDataLocalStorage(): void {
    const sequenceThirdParty = JSON.parse(localStorage.getItem('sec')).sequenceThirdParty;
 
    this.expedienteService.getListaExpedientes(sequenceThirdParty).subscribe((datas) => {
        if (datas.result) {
          console.log(datas)
          datas.lista_expedientes.filter((value) => {            
            if (value.expediente === this.expediente) {
              console.log("aqui va",this.expediente);
              console.log("aqui va",value.expediente)
              const newResolucion = {
                sequenceThirdParty2: value.exp_sec.toString(),
              };
              localStorage.setItem('expediente', JSON.stringify(newResolucion));
          
              const responsable = JSON.parse(localStorage.getItem('responsable'));
          
              responsable.sequenceThirdParty2 = JSON.stringify(value.exp_sec);

              const bodyListas={
                sequenceThirdParty2:responsable.sequenceThirdParty2,
                sequenceThirdParty:responsable.sequenceThirdParty
              }
              
/*               this.expedienteService.consultaArchivo(bodyListas).subscribe((dataRe) => {

                this.archivos=dataRe.tablaArchivos
                  if (dataRe.tablaArchivos) {
                    console.log("listas-tabla",dataRe.tablaArchivos);
                    this.isLoading = false;
                    this.collectionSize= this.archivos.length;
                    this.archivos = this.archivos
                        .map((archivo, i) => ({id: i + 1, ...archivo}))
                        .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
                    console.log(this.collectionSize)
                    // tslint:disable-next-line:radix
                   
                  }
                }); */
            }
          });
        }
      });
    // this.postExpediente(data.id);
  }
  saveObligation(indexForm: number) {
    const obligacionValue: ObligacionValue = this.obligacionesFormArray.controls[indexForm].value;
    this.consultaObligacion();
    const guardarObligacion: GuardarObligacionRequest = {
      observaciones: obligacionValue.observaciones,
      secResol: this.radicadoR,
      viMotivoParcial:obligacionValue.viMotivoParcial,
      descripcion: obligacionValue.descripcion,    
      linea: null,
      sequenceThirdParty: Number(this.secuenciaTercero),
      sequenceThirdParty2: Number(this.expediente)
    }

    this.expedienteService.postGuardarObligacion(guardarObligacion).subscribe((obligacionResponse: GuardarObligacionResponse) => {
      const formGroup: FormGroup = this.obligacionesFormArray.controls[indexForm] as FormGroup;
      formGroup.controls.line.setValue(obligacionResponse.line);

      this.consultaObligacion();
      if (obligacionResponse.result) {
        const formAndFile: FormAndFiles = this.formAndFiles.find(item => item.indexForm === indexForm);
        if (formAndFile && formAndFile.files && formAndFile.files.length) {
          this.consultaObligacion();
        }
        Swal.fire({
          title: 'Desea Guardar cambios?',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: `Guardar`,
         
        }).then((result) => {
        formAndFile.files.forEach((file) => {
          const fileData = new FormData();
          fileData.append('sequenceThirdParty2', this.expediente);
          fileData.append('sequenceThirdParty', this.secuenciaTercero);
          fileData.append('line', obligacionResponse.line);
          fileData.append('file', file);
/*           fileData.append('coorX', obligacionValue.coorX);
          fileData.append('coorY', obligacionValue.coorY);          
          fileData.append('fechaFoto', obligacionValue.fechaFoto); */
          
          this.consultaObligacion();
             // alert('ARCHIVO ' + file.name + 'GUARDADO CON line -> ' + line);
            }
          );
        });
      }
    });
  }
  public dataBuilder(): void {
    this.formulario = this.fb.group({
      contenido: this.fb.array([this.addObligacion()]),
    });
  }
 
/*   public consultaArchivos(): void {
    const consultaArchivo = {
      // tslint:disable-next-line:radix
      sequenceThirdParty2: parseInt(this.expediente),
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
  /* public consultaObligacion(expe, secuenciaTercero): void {
    const sequenceThirdParty = JSON.parse(localStorage.getItem('sec')).sequenceThirdParty;
    const {documentos} = this.formulario.value.contenido[0];
    const obligacion = {
      // tslint:disable-next-line:radix
      sequenceThirdParty2: parseInt(expe),
      // tslint:disable-next-line:radix
      sequenceThirdParty: parseInt(sequenceThirdParty),
    };
    this.dataObligacion = obligacion;
    console.log()
    // tslint:disable-next-line:radix
    console.log(parseInt(expe));
    this.expedienteService
      .getConsultarObligacion$(obligacion)
      .subscribe((data) => {
        if (data.result) {
           console.log(data.obligaciones);
          this.obligaciones = data.obligations;
          this.isLoading2 = false;
          this.consultaArchivos();
          console.log(this.obligaciones);
          this.obligaciones.map((datas) => {
            this.lineR = datas.niLinea;
          });
       
        }
      });
  } */

  public consultaObligacion(): void {
    const sec= JSON.parse(localStorage.getItem('sec')).sequenceThirdParty;
    const expedi = JSON.parse(localStorage.getItem('expediente')).sequenceThirdParty2;
    const dtoArchivo = {
      // tslint:disable-next-line:radix
      sequenceThirdParty2: parseInt(expedi),
      // tslint:disable-next-line:radix
      sequenceThirdParty: parseInt(sec),
    };
 
      this.expedienteService.consultaArchivo(dtoArchivo ).subscribe((data) => {
        //this.archivos=data.tablaArchivos;
        console.log("archivo eliminar",this.archivos);
        this.archivos.map((item=>{
          console.log(item.archivoNro);
          let itemArchivo= item.archivoNro
     
    }))
    
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

  

  
 
  deleteFormObligacion(indexForm: number) {
    const sequenceThirdParty = JSON.parse(localStorage.getItem('sec')).sequenceThirdParty;
    const sequenceThirdParty2 = JSON.parse(localStorage.getItem('expediente')).sequenceThirdParty2;
    
    const formGroup: FormGroup = this.obligacionesFormArray.controls[indexForm] as FormGroup;
    const line = formGroup.controls.line.value;
    if (line) {
      this.expedienteService.eliminarObligacion(line, sequenceThirdParty, sequenceThirdParty2).subscribe(
        resp => {
        this.obligacionesFormArray.removeAt(indexForm);
      }, error => {
        console.log(JSON.stringify(error));
      }) 
    } else {
      this.obligacionesFormArray.removeAt(indexForm);
    }
  }
  public eliminarObligacion(niLinea, i): void {
    const sequenceThirdParty = JSON.parse(localStorage.getItem('sec')).sequenceThirdParty;
    const sequenceThirdParty2 = JSON.parse(localStorage.getItem('expediente')).sequenceThirdParty2;
    Swal.fire({
      title: '¿Desea eliminar esta Obligación?',
      icon: 'question',
      confirmButtonText: 'Aceptar',
      denyButtonText: 'Cancelar',
      showDenyButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const borrarObligacion = {
          sequenceThirdParty2: sequenceThirdParty2,
          sequenceThirdParty: sequenceThirdParty,
          obligaLinea:niLinea,
          
        };
        console.log(niLinea)
        this.expedienteService
          .postEliminarObligacion(niLinea,sequenceThirdParty,sequenceThirdParty2)
          .subscribe((data) => {
            if (data.result) {
              Swal.fire(`${data.mensaje}`, '', 'success');
              this.obligacionesFormArray.removeAt(niLinea);
              this.obligaciones.splice(i, 1);
            }else {
              this.obligacionesFormArray.removeAt(niLinea);
            }
          }, (err) => {
            console.log(err);
          });
      } else if (result.isDenied) {
        Swal.fire('Cambios no guardados', '', 'info');
      }
    });
  } 

  public atrasSegundo(estado: any): void {
    // this.completo1 = !estado;
    this.isEditable1 = estado;
  }

  public siguientePrimero(): void {
    this.consultaObligacion();
    console.log("refresh");
    this.siguientePrimeroOut.emit(true);
    Swal.fire({
      title: '¿Está seguro que desea adjuntar esta información?',
      icon: 'question',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.consultaObligacion();
        this.stepper.next();
      } else {
      }
    });
  }

}
