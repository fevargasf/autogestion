import { Expediente } from "./expediente.interface";

export interface RadicarPdf{    
    sequenceThirdParty:number;
    sequenceThirdParty2:number;
    expedientDTO:Expediente;
    radicado:string;
    fechaRadicado:string;
}