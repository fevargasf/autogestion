import { Component, OnInit,Input, Output, EventEmitter } from "@angular/core";
import { PDFDocumentProxy } from "ng2-pdf-viewer";
import { HttpClient } from "@angular/common/http";
import {ExpedienteService} from 'src/app/core/services/expediente.service';
import Swal from 'sweetalert2';
// importing the fonts and icons needed
import pdfFonts from "./../../../../../assets/vfs_fonts";
import { fonts } from "./../../../../config/pdfFonts";
import { styles, defaultStyle } from "./../../../../config/customStyles";
// import the pdfmake library
import  pdfMake from "pdfmake/build/pdfmake";

// PDFMAKE fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = fonts;
@Component({
  selector: 'app-output-document',
  templateUrl: './output-document.component.html',
  styleUrls: ['./output-document.component.scss']
})
export class OutputDocumentComponent  {
@Input() radicado:any;
@Input() pdfSrc:string; // this sample, dynamic one we will generate with the pdfmake
  pageVariable = 1;
  // Initialize variables required for the header and this component
  fileName = "Documento.pdf";
  // set zoom variables
  zoom = 0.7; // default initial zoom value
  zoomMax = 2; // max zoom value
  zoomMin = 0.5; // min zoom value
  zoomAmt = 0.2; // stepping zoom values on button click
  zoomScale = "page-width"; // zoom scale based on the page-width
  totalPages = 0; // indicates the total number of pages in the pdf document
  pdf: PDFDocumentProxy; // to access pdf information from the pdf viewer
  documentDefinition: object;
  generatedPDF: any;
  public downloaded: string | undefined;


  constructor(
    private expediente: ExpedienteService) { }


  // to know the browser is IE or not
  isIE(): boolean {
    return navigator.userAgent.lastIndexOf("MSIE") !== -1;
  }

  // to know the browser is Edge or not
  isEdge(): boolean {
    return !this.isIE() && !!window;
  }

  // after load complete of the pdf function
  afterLoadComplete(pdf: PDFDocumentProxy): void {
    this.pdf = pdf;
    this.totalPages = pdf?.numPages;
  }


  generatePDF(): void {
    const sec = JSON.parse(localStorage.getItem('sec'));
    const expediente = JSON.parse(localStorage.getItem('expediente'));
    const expedienteActual = JSON.parse(this.expediente.getData('expedienteActual'));
    let data = {
      sequenceThirdParty : sec.sequenceThirdParty,
      sequenceThirdParty2 :expedienteActual.exp_sec
    }
   // this.pdfUrl=  this.expediente.consultaArchivoURL(data);


    //this.pdfUrl =`http://localhost:5000/api/self-management/listar-archivos/consulta-archivos?sequenceThirdParty2=${expediente.sequenceThirdParty2}&sequenceThirdParty=${sec.sequenceThirdParty}`;

  }



}
