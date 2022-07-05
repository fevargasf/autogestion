export interface ObligacionValue {
  descripcion: string;
  observaciones: string;
  viMotivoParcial: string;
  line: string;
  sistema_coordenadas: number;
}


export interface ObligaArchivoDTO {
  obligaLinea: number;
  obligaDescripcion: String;
  obligaObservacion: String;
  viMotivoParcial:string;
  archivos:any[];
}
