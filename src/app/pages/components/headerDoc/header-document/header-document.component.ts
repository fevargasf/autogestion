import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import Swal from 'sweetalert2';
@Component({
  selector: 'app-header-document',
  templateUrl: './header-document.component.html',
  styleUrls: ['./header-document.component.scss']
})
export class HeaderDocumentComponent implements OnInit {
  @Input() fileName = "";
  @Input() currentPage: number;
  @Input() totalPages: number;
  @Input() zoomAmt: number;
  @Input() zoomMax: number;
  @Input() zoomMin: number;
  @Input() pdfSrc; 
  @Output() setZoom: EventEmitter<any> = new EventEmitter();
  @Output() download: EventEmitter<any> = new EventEmitter();
  @Output() print: EventEmitter<any> = new EventEmitter();
  constructor(
    
  ) { }
  ngOnInit(): void {
    
  }
  onDownload(event: any): void {
    this.download.emit();
  }

  onPrint(event: any): void {
    this.print.emit();
  }

  zoom(type: string): void {
    this.setZoom.emit(type);
  }

}
