import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpedienteService } from 'src/app/core/services/expediente.service';
import { Archivos } from 'src/app/pages/components/interfaces/archivos';
import { DataObligacion } from 'src/app/pages/components/interfaces/data-obligacion';
import { EliminarObligacionDTO } from 'src/app/pages/components/interfaces/eliminarObligacionDTO';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

export interface FormAndFiles {
  indexForm: number;
  files: File[];
}
@Component({
  selector: 'app-table-archivos',
  templateUrl: './table-archivos.component.html',
  styleUrls: ['./table-archivos.component.scss'],
})
export class TableArchivosComponent implements OnInit {
  public dataObligacion: DataObligacion;
  public formulario: FormGroup;
  public archivoNro: number;
  public obligaLinea: number;
  public descripcion: String;
  public observaciones: String;
  public expediente: string;
  public dataActualizarObliga: any;
  @Input() archivos: Archivos[] = [];
  @Input() isLoading: boolean;
  @Input() set dataObligaciones(values: any) {
    this.dataObligacion = values;
  }
  formObligaciones: FormGroup;
  formAndFiles: FormAndFiles[] = [];
  expansionPanelIndex = 0;
  constructor(
    private expedienteService: ExpedienteService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.formObligaciones = this.fb.group({
      obligaciones: this.fb.array([this.formGroup()]),
    });

    this.formAndFiles.push({
      indexForm: 0,
      files: [],
    });
  }

  ngOnInit(): void {
    this.consultaObligacion();
    this.eliminarObligacion;
  }
  get obligacionesFormArray() {
    return this.formObligaciones.controls['obligaciones'] as FormArray;
  }
  get addObligacionArray(): FormArray {
    return this.formulario.get('contenido') as FormArray;
  }
  formGroup(): FormGroup {
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

  addFormObligacion() {
    this.formAndFiles.push({
      indexForm: this.obligacionesFormArray.length,
      files: [],
    });
    const formObligacion = this.formGroup();
    this.obligacionesFormArray.push(formObligacion);
  }

  public eliminarArchivo(niLineaObligacion, archivoNro, index): void {
    const sequenceThirdParty = JSON.parse(
      localStorage.getItem('sec')
    ).sequenceThirdParty;
    const sequenceThirdParty2 = JSON.parse(
      localStorage.getItem('expediente')
    ).sequenceThirdParty2;
    Swal.fire({
      title: '¿Desea eliminar este archivo?',
      icon: 'question',
      confirmButtonText: 'Aceptar',
      denyButtonText: 'Cancelar',
      showDenyButton: true,
    }).then((result) => {
      const dtoArchivo = {
        // tslint:disable-next-line:radix
        sequenceThirdParty2: parseInt(sequenceThirdParty2),
        // tslint:disable-next-line:radix
        sequenceThirdParty: parseInt(sequenceThirdParty),
      };
      this.expedienteService.consultaArchivo(dtoArchivo).subscribe((data) => {
        //this.archivos = data.tablaArchivos;
        console.log('archivo eliminar', this.archivos);
        this.archivos.map((item) => {
          console.log(item.archivoNro);
          let niNroArchivo = item.archivoNro;
          let niLineaObligacion = item.obligaLinea;

          const objArchivo = {
            obligaLinea: niLineaObligacion,
            archivoNro: niNroArchivo,
            sequenceThirdParty,
            sequenceThirdParty2,
          };
          if (niNroArchivo >= 0) {
            console.log(this.archivos);
            this.archivos.map((data) => {
              this.archivoNro = data.archivoNro;
              this.obligaLinea = data.obligaLinea;

              const params = {niLineaObligacion, niNroArchivo, sequenceThirdParty, sequenceThirdParty2};
              this.expedienteService.eliminarArchivos(params).subscribe(response => {
                  if (response) {
                    Swal.fire(`${response}`, '', 'success');
                    this.consultaObligacion();
                    console.log('aqui refresca', this.consultaObligacion);
                    this.archivos.splice(index, 1);
                  } else if (result.isDenied) {
                    Swal.fire('Cambios no guardados', '', 'info');
                  }
                });
            });
          }
        });
      });
      if (result.isConfirmed) {
        const dataBorrarArchivo = {
          sequenceThirdParty2: parseInt(sequenceThirdParty2),
          sequenceThirdParty: parseInt(sequenceThirdParty),
          obligaLinea: niLineaObligacion,
          archivoNro: archivoNro,
        };
      }
    });
  }

  public eliminarObligacion(niLinea, i): void {
    const sequenceThirdParty = JSON.parse(
      localStorage.getItem('sec')
    ).sequenceThirdParty;
    const sequenceThirdParty2 = JSON.parse(
      localStorage.getItem('expediente')
    ).sequenceThirdParty2;
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
          obligaLinea: niLinea,
        };
        this.consultaObligacion();
        this.expedienteService
          .postEliminarObligacion(
            niLinea,
            sequenceThirdParty,
            sequenceThirdParty2
          )
          .subscribe(
            (data) => {
              if (this.dataObligaciones) {
                console.log(data, this.dataObligaciones);
                Swal.fire(`${data.voError}`, '', 'info');
                this.consultaObligacion();
                console.log('aqui refresca', this.consultaObligacion);
                this.archivos.splice(niLinea, 1);

                this.obligacionesFormArray.removeAt(niLinea);
                const dtoArchivo = {
                  // tslint:disable-next-line:radix
                  sequenceThirdParty2: parseInt(sequenceThirdParty2),
                  // tslint:disable-next-line:radix
                  sequenceThirdParty: parseInt(sequenceThirdParty),
                };
                this.expedienteService
                  .consultaArchivo(dtoArchivo)
                  .subscribe((data) => {
                  //  this.archivos = data.tablaArchivos;
                    console.log('archivo eliminar', this.archivos);
                    this.archivos.map((item) => {
                      console.log(item.archivoNro);
                      let niNroArchivo = item.archivoNro;
                      let niLineaObligacion = item.obligaLinea;

                      const objArchivo = {
                        obligaLinea: niLineaObligacion,
                        niNroArchivo: niNroArchivo,
                        sequenceThirdParty,
                        sequenceThirdParty2,
                      };
                      if (niNroArchivo) {
                        console.log(this.archivos);
                        this.archivos.map((data) => {
                          this.archivoNro = data.archivoNro;
                          this.obligaLinea = data.obligaLinea;
                        });
                      }
                    });
                  });
              }
            },
            (err) => {
              console.log(err);
            }
          );
      } else if (result.isDenied) {
        Swal.fire('Cambios no guardados', '', 'info');
      }
    });
  }

  public actualizarObligacion(modal, obligacion: Archivos): void {
    const sequenceThirdParty = JSON.parse(
      localStorage.getItem('sec')
    ).sequenceThirdParty;
    const sequenceThirdParty2 = JSON.parse(
      localStorage.getItem('expediente')
    ).sequenceThirdParty2;
    this.descripcion = obligacion.obligaDescripcion;
    this.observaciones = obligacion.obligaObservacion;
    this.expediente = obligacion.expediente;
    this.dialog.open(modal);
    this.dataActualizarObliga = {
      sequenceThirdParty2: sequenceThirdParty2,
      sequenceThirdParty: sequenceThirdParty,
      secResol: obligacion.docSecResol,
      nioLinea: obligacion.obligaLinea,
    };
    const dtoArchivo = {
      // tslint:disable-next-line:radix
      sequenceThirdParty2: parseInt(sequenceThirdParty2),
      // tslint:disable-next-line:radix
      sequenceThirdParty: parseInt(sequenceThirdParty),
    };
    this.expedienteService.consultaArchivo(dtoArchivo).subscribe((data) => {
      //this.archivos = data.tablaArchivos;
      console.log('archivo eliminar', this.archivos);
      this.archivos.map((item) => {
        console.log(item.archivoNro);
        let archivoNro = item.archivoNro;
        let niLineaObligacion = item.obligaLinea;

        const objArchivo = {
          obligaLinea: niLineaObligacion,
          archivoNro: archivoNro,
          sequenceThirdParty,
          sequenceThirdParty2,
        };
      });
    });
  }

  public ActualizarObligacion(): void {
    const sequenceThirdParty = JSON.parse(
      localStorage.getItem('sec')
    ).sequenceThirdParty;
    const sequenceThirdParty2 = JSON.parse(
      localStorage.getItem('expediente')
    ).sequenceThirdParty2;
    Swal.fire({
      title: '¿Desea Actualizar esta Obligación?',
      icon: 'question',
      confirmButtonText: 'Aceptar',
      denyButtonText: 'Cancelar',
      showDenyButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const descripcion = this.descripcion;
        const observaciones = this.observaciones;
        const { ...object } = this.dataActualizarObliga;
        object.descripcion = descripcion;
        object.observaciones = observaciones;
        console.log(object);
        this.expedienteService
          .postGuardarObligacion(object)
          .subscribe((datas) => {
            if (datas.result) {
              Swal.fire(`Obligacion Actualizada Correctamente`, '', 'success');
              this.dialog.closeAll();
              this.consultaObligacion();
              console.log('aqui refresca', this.consultaObligacion);
            }
          });
      } else if (result.isDenied) {
        Swal.fire('Cambios no guardados', '', 'info');
        this.dialog.closeAll();
      }
    });
  }

  public consultaObligacion(): void {
    const sequenceThirdParty = JSON.parse(
      localStorage.getItem('sec')
    ).sequenceThirdParty;
    const sequenceThirdParty2 = JSON.parse(
      localStorage.getItem('expediente')
    ).sequenceThirdParty2;
    const dtoArchivo = {
      // tslint:disable-next-line:radix
      sequenceThirdParty2: parseInt(sequenceThirdParty2),
      // tslint:disable-next-line:radix
      sequenceThirdParty: parseInt(sequenceThirdParty),
    };

    this.expedienteService.consultaArchivo(dtoArchivo).subscribe((data) => {
      //this.archivos = data.tablaArchivos;
      console.log('archivo eliminar', this.archivos);
      this.archivos.map((item) => {
        console.log(item.archivoNro);
        let itemArchivo = item.archivoNro;

        /* const objArchivo={
        niLineaObligacion:niLinea,
        itemArchivo:niNroArchivo,
        sequenceThirdParty, 
        sequenceThirdParty2

      }
      if (itemArchivo !== null) {
        console.log(this.archivos);
        this.archivos.map((data)=>{
          this.archivoNro= data.archivoNro
          this.expedienteService.eliminarArchivos()
        })
      
       
    
     } */
      });
    });
  }
  deletedFile(niLineaObligacion, niNroArchivo) {
    const sequenceThirdParty = JSON.parse(
      localStorage.getItem('sec')
    ).sequenceThirdParty;
    const sequenceThirdParty2 = JSON.parse(
      localStorage.getItem('expediente')
    ).sequenceThirdParty2;
    const arcElimina = {
      archivoNro: niNroArchivo,
      niLineaObligacion: niLineaObligacion,
    };
    if (niNroArchivo) {
      const params = {niLineaObligacion, niNroArchivo, sequenceThirdParty, sequenceThirdParty2};
      this.expedienteService
        .eliminarArchivos(params).subscribe(
          (resp) => {
            this.obligacionesFormArray.removeAt(niNroArchivo);
          },
          (error) => {
            console.log(JSON.stringify(error));
          }
        );
    }
    /*  const formAndFileByIndexForm: FormAndFiles = this.formAndFiles.find(item => item.indexForm === indexForm);
    formAndFileByIndexForm.files.splice(niNroArchivo, 1); */
  }
}
