import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Resolucion} from 'src/app/pages/components/interfaces/resolucion.interface';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-table-resolucion',
  templateUrl: './table-resolucion.component.html',
  styleUrls: ['./table-resolucion.component.scss']
})
export class TableResolucionComponent implements OnInit {
  @Input() resoluciones: Resolucion[] = [];
  @Input() isLoading: boolean;
  @Input() sinResolucion: boolean;
  @Output() evento:EventEmitter<any> = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  allData: Resolucion[] = [];
    // MatPaginator Inputs
    length = 100;
    pageSize = 5;
    pageSizeOptions: number[] = [5, 10, 25, 100];
      // MatPaginator Output
    pageEvent: PageEvent;
    activePageDataChunk = [];

  public dataSource: MatTableDataSource<Resolucion>;

       private router: Router
       constructor() {
     this.dataSource = new MatTableDataSource([]);
  }


  ngOnInit(): void {
    this.dataSource.data = this.resoluciones;

  }
  ngOnChanges() {
    if (this.resoluciones) {
      this.dataSource.data = this.resoluciones;
      this.activePageDataChunk = this.dataSource.data.slice(0,this.pageSize);
      this.allData = [...this.resoluciones];

    }

/*     if(this.resoluciones.length === 0){
      this.router.navigate(['lista-expedientes']);
      Swal.fire({title:'No hay resoluciones registradas.',
        text:'Te retornamos a la busqueda de expediente.',
        icon:'warning',
        timer:2000
      })
    } */
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue === '') {
      this.activePageDataChunk = [...this.allData]; // Restaurar todos los valores
    } else {
    this.activePageDataChunk = this.activePageDataChunk?.filter(codigo =>
      codigo.radicado.trim().toLowerCase().includes(filterValue.trim().toLowerCase())
    );

   // return this.activePageDataChunk;
  }
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  onPageChanged(e) {
    let firstCut = e.pageIndex * e.pageSize;
    let secondCut = firstCut + e.pageSize;
    this.activePageDataChunk = this.dataSource.data.slice(firstCut, secondCut);
  }

  seleccionarResolucion(value){
    this.evento.emit(value);
    localStorage.setItem('radicadoR', JSON.stringify(value.expe_sec));
  }


}
