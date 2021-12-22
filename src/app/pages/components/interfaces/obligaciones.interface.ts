export interface Obligaciones {
    niLinea: number;
    nombre_obligacion: string;
    observaciones: string;
    fecha_creacion: Date;
    consecutivo: number;
    expediente: string;
    obligaLinea: number;
    obligaDescripcion: string;
    obligaObservacion: string;
    obligaFechaCreacion: Date;
    docSecResol: string;
    radicadoResolucion: string;
    archivoNro: number;
    archivoNombre: string;
    archivo: null;
    fechaIngresoArchivo: Date;
    fechaFoto: string;
    coorX: number;
    coorY: number;
    viMotivoParcial:string;
    comoTermina:string;
}
