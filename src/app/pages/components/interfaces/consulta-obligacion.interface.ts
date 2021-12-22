import {Obligaciones} from "./obligaciones.interface";

export interface ConsultaObligacion {
  result: boolean;
  obligaciones: Obligaciones[]
}
