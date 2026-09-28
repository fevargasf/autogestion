import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ExpedienteService} from 'src/app/core/services/expediente.service';
import {DataObligacion} from 'src/app/pages/components/interfaces/data-obligacion';
import {Obligaciones} from 'src/app/pages/components/interfaces/obligaciones.interface';
import Swal from 'sweetalert2';
import {MatStepper} from '@angular/material/stepper';

@Component({
  selector: 'app-table-obligaciones',
  templateUrl: './table-obligaciones.component.html',
  styleUrls: ['./table-obligaciones.component.scss'],
})
export class TableObligacionesComponent implements OnInit {
  public dataObligacion: DataObligacion;
  public nombreObligaciones: string;
  public observaciones: string;
  public expediente: string;
  public dataActualizarObliga: any;
  @Input() obligaciones: Obligaciones[] = [];

  @Input() set dataObligaciones(values: any) {
    this.dataObligacion = values;
  }

  @Input() isLoading: boolean;

  constructor(
    private expedienteService: ExpedienteService,
    private dialog: MatDialog,
    private stepper: MatStepper
  ) {
  }

  ngOnInit(): void {

  }

  public eliminarObligacion(line, i): void {
    Swal.fire({
      title: '¿Desea eliminar esta Obligación?',
      icon: 'question',
      confirmButtonText: 'Aceptar',
      denyButtonText: 'Cancelar',
      showDenyButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const borrarObligacion = {
          expecter: this.dataObligacion.expecter,
          sequenceThirdParty: this.dataObligacion.sequenceThirdParty,
          line,
        };
        /* this.expedienteService
          .postEliminarObligacion(borrarObligacion)
          .subscribe((data) => {
            if (data.result) {
              Swal.fire(`${data.mensaje}`, '', 'success');
              this.obligaciones.splice(i, 1);
            }
          }, (err) => {
            console.log(err);
          }); */
      } else if (result.isDenied) {
        Swal.fire('Cambios no guardados', '', 'info');
      }
    });
  }
/*
  public actualizarObligacion(modal, obligacion: Obligaciones): void {
    this.nombreObligaciones = obligacion.nombre_obligacion;
    this.observaciones = obligacion.observaciones;
    this.expediente = obligacion.expediente;
    this.dialog.open(modal);
    this.dataActualizarObliga = {
      expecter: this.dataObligacion.expecter,
      sequence: this.dataObligacion.sequenceThirdParty,
      secR: 321525,

    };
  } */
/*
  public ActualizarObligacion(): void {
    Swal.fire({
      title: '¿Desea Actualizar esta Obligación?',
      icon: 'question',
      confirmButtonText: 'Aceptar',
      denyButtonText: 'Cancelar',
      showDenyButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const nombre = this.nombreObligaciones;
        const observaciones = this.observaciones;
        const {...object} = this.dataActualizarObliga;
        object.nombre_obligacion = nombre;
        object.observaciones = observaciones;
        console.log(object);
        this.expedienteService
          .postGuardarObligacion(object)
          .subscribe((datas) => {
            if (datas.result) {
              Swal.fire(`Obligacion Actualizada Correctamente`, '', 'success');
              this.dialog.closeAll();
            }
          });
      } else if (result.isDenied) {
        Swal.fire('Cambios no guardados', '', 'info');
        this.dialog.closeAll();
      }
    });
  } */

  public atrasPrimero(): void {
    this.stepper.previous();
  }

  public siguientePrimero(): void {
    // this.stepper.next();
  }
}
