export interface ObligacionValue {
  descripcion: string;
  observaciones: string;
  viMotivoParcial: string;
  line: string;
  sistema_coordenadas: number;
  origen?:any;
  WGS84?:any;
  estadObligacion?:string;
}


export interface ObligaArchivoDTO {
  obligaLinea: number;
  obligaDescripcion: String;
  obligaObservacion: String;
  viMotivoParcial:string;
  archivos:any[];

}
