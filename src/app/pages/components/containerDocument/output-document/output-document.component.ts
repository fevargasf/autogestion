import { Component, OnInit,Input } from "@angular/core";
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
export class OutputDocumentComponent implements OnInit {
  @Input() radicado:any;
  
 // expediente: any;
 @Input() pdfSrc; // this sample, dynamic one we will generate with the pdfmake
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
  pdfData;
  fileUrl;
  public progress;
  public percentLoaded;
  public downloaded: string | undefined;
  expedienteService: any;
  constructor(
    private httpClient: HttpClient,
    private expediente: ExpedienteService) { }
    
  ngOnInit(): void {
    console.log(this.pdfSrc);
    this.pageVariable = 1;
  }
  onProgress(event) {
   
if(this.pageVariable   === 1){


}else if(event.loaded / event.total * 100){
 

}
    var percentLoaded = event.loaded / event.total * 100;
  
    console.log( Math.round((100 * event.loaded) / event.total))
   
   console.log(percentLoaded,"Avanzo" );
 
  }
 
  



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
    this.totalPages = pdf.numPages;
  }

  generatePDF(): void {
    const expediente = JSON.parse(localStorage.getItem('expediente'));
    const expedienteActual = JSON.parse(sessionStorage.getItem('expedienteActual'));
    const sec = JSON.parse(localStorage.getItem('sec'));
    const responsable = JSON.parse(localStorage.getItem('responsable'));
    
    // All the contents required goes here
    this.documentDefinition = {
      expedientDTO: {
        respon_nombre: responsable.nombre,
        respon_correo: responsable.correo,
        respon_cargo: responsable.cargo,
        ter_celular: responsable.telefonoCelular,
        ter_dir_municipio:expedienteActual.ter_dir_municipio,
        expediente:expedienteActual.expediente
      },
      radicado: this.radicado.radicado,
      fechaRadicado:this.radicado.fechaRadicado,
      ruta: this.radicado.ruta,
      sequenceThirdParty: parseInt(sec.sequenceThirdParty),
      sequenceThirdParty2: parseInt(expediente.sequenceThirdParty2),
      pageSize: "A4",
      pageOrientation: "landscape",
      pageMargins: [40, 60, 40, 60], // left, top, right, bottom margin values
      content: [
        {
          text: "Sample test to check the font",
          style: "head", // normal text with custom font
        },
        {
          text: ">",
          font: "Icomoon", // icon intgerated to the pdfmake document
          fontSize: 18,
        },
      ], // it will be discussed later
      styles,
      defaultStyle,
    };

    // Generating the pdf
    this.generatedPDF = pdfMake.createPdf(this.documentDefinition);
    console.log(this.generatedPDF)
    // This generated pdf buffer is used for the download, print and for viewing
    this.generatedPDF.getBuffer((buffer) => {
      this.pdfSrc = buffer;
    });
  }

  getData(): void {
    
        this.generatePDF();

  }

}
