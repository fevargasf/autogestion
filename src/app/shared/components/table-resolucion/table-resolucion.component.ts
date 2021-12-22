import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Resolucion} from 'src/app/pages/components/interfaces/resolucion.interface';

@Component({
  selector: 'app-table-resolucion',
  templateUrl: './table-resolucion.component.html',
  styleUrls: ['./table-resolucion.component.scss']
})
export class TableResolucionComponent implements OnInit {
  @Input() resoluciones: Resolucion[] = [];
  @Input() isLoading: boolean;

  @Output() evento:EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  seleccionarResolucion(value){
    this.evento.emit(value);
    localStorage.setItem('radicadoR', JSON.stringify(value.expe_sec));
  }

}
