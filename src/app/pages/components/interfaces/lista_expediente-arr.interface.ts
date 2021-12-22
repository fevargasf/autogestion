export interface ListaExpedienteArr {
  exp_sec:number
  expediente: string;
  asu_codigo: string;
  nombre_asunto: string;
  exp_estado: string;
  territorial: string;
  ter_sec: number;
  ter_tipo_documento: string;
  ter_documento: string;
  ter_nombres: string;
  ter_direccion: string;
  ter_dir_municipio: string;
  ter_dir_depto: string;
  ter_email: string;
  ter_telefono: string;
  ter_celular: string;
  ter_naturaleza: string;
  ultima_autogestion: string;
  admite_autogestion: string;
  motivo_no_admite: string;
  nombre_responsable?:string;
  email_responsable?:string;
  celular_responsable?:string;
  cargo_responsable?:string;
}
