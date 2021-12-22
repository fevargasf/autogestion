export interface ObligacionValue {
  descripcion: string;
  observaciones: string;
  viMotivoParcial: string;
  line: string;
  
}


export interface ObligaArchivoDTO {
  obligaLinea: number;
  obligaDescripcion: String;
  obligaObservacion: String;
  viMotivoParcial:string;
  archivos:any[];
}
