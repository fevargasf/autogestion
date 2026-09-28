import { Obligaciones } from "./obligaciones.interface";

export interface ListaTabla {
    obligaLinea: number;
    comoTermina:string;
    archivos: Obligaciones[]
}
