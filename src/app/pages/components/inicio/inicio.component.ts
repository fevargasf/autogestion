import {Component, OnInit, ViewChild,Output,EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import {ActivatedRoute} from '@angular/router';
import { Resolucion } from 'src/app/pages/components/interfaces/resolucion.interface';
import {Obligaciones} from "src/app/pages/components/interfaces/obligaciones.interface";
import { Archivos } from 'src/app/pages/components/interfaces/archivos';
import { ExpedienteService } from 'src/app/core/services/expediente.service';
import { ListaExpedientes } from 'src/app/pages/components/interfaces/lista_expedientes.interface';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  @ViewChild("stepper") stepper:MatStepper;
  public selectedIndex:number = 0;

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
  constructor(
    private expedienteService: ExpedienteService,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.resoluciones = [];
    this.obligaciones = [];
    this.archivos = [];
  }

  ngOnInit(): void {
    this.dataParams();
    this.getDataLocalStorage();
    this.dataBuilder();

  }
  
  public dataBuilder(): void {
    this.formulario = this.fb.group({
      contenido: this.fb.array([this.addObligacion()]),
    });
  }
  
  public dataParams(): void {
    this.activeRoute.params.subscribe(params => {
      this.tipoPersona = params.tipoPersona;
      this.expediente = params.expediente;
    });
  }
  public generarPdf():void{

  }

  public addObligacion(): FormGroup {
    return this.fb.group({
      nombre_obligacion: ['', Validators.required],
      documentos: [[], Validators.required],
      observaciones: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }
  public getDataLocalStorage(): void{
    const sequenceThirdParty = JSON.parse(localStorage.getItem('sec')).sequenceThirdParty;
   
    
    
    // console.log(this.sec);
     this.expedienteService.getListaExpedientes(sequenceThirdParty ).subscribe((datas: ListaExpedientes) => {
      if (datas.result){
        datas.lista_expedientes.filter((value) => {
          if (value.exp_sec ===  this.expediente){
            const newResolucion = {
              sequenceThirdParty2: value.expediente.toString()
            };
            localStorage.setItem('expediente', JSON.stringify(newResolucion));
            // console.log(newResolucion);
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
    this.stepper.next();
  }

  seleccionObligacion(obligaciones){
    this.obligaciones = obligaciones;

    this.completoInicio = true;
    this.isEditableInicio = false;
    this.isEditable1 = true;
    this.stepper.next();
  }  

  public siguientePrimero(estado: any): void {    
    this.completo1 = estado;
    this.isEditable1 = !estado;
    // this.stepper.next();

    this.isEditable2 = true;
    this.eventSubject.next(true);
  }

  public siguienteSegundo2(estado: any): void {
    this.completo2 = estado;
    this.isEditable2 = !estado;
  }

  public siguienteSegundo(radicado:any): void {    
    this.radicado = radicado;
    let estado = radicado?true:false;
    this.completo3 = estado;
    this.isEditable3 = !estado;
    this.stepper.next();
  }

  public siguienteConfirmacion(estado: any): void {
    this.completo2 = estado;
    this.isEditable2 = !estado;
  }

  public atrasPrimero(estado: any): void {
    this.isEditable1 = false;

    this.isEditableInicio = true;
    this.completoInicio = false;
    
    setTimeout(() => {      
      this.stepper.previous();
      
    this.eventSubject.next(false);
    },10);    
    
    this.eventSubject.next(false);
  }  

  public atrasSegundo(estado: any): void {
    this.isEditable2 = false;

    this.isEditable1 = true;
    this.completo1 = false;
    
    setTimeout(() => {      
      this.stepper.previous();
      
    this.eventSubject.next(false);
    },10);    
  }

  public atrasTercero(estado: any): void {
    // this.completo1 = !estado;
    this.isEditable3 = estado;
  }

  public expedienteData(data: any): void {
    console.log(data);
  }

  public cargar(val: any): void{
    // console.log(val);
    this.nombreArchivo = val.files[0].name;
    this.valueArchivo = val.value;
    if (this.valueArchivo === ''){
      // console.log('no cargo nada', this.valueArchivo);
      this.visualizarBtn = false;
    }else {
      // console.log('si cargo algo', this.valueArchivo);
      this.visualizarBtn = true;
    }
  }


}
