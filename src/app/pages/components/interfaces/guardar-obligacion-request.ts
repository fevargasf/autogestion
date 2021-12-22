import { BaseDTO } from "./base-dto";

export interface GuardarObligacionRequest extends BaseDTO {
    secResol?: number;
    descripcion?: string;
    observaciones?: string;
    viMotivoParcial?:string;
    comoTermina?: string;
    linea?: number;
    nioLinea?:number;
}
