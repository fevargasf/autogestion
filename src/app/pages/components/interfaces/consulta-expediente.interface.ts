export interface ConsultaListaExpediente {
  result:                     boolean;
  consulta_lista_expedientes: ConsultaListaExpedienteArr[];
}

export interface ConsultaListaExpedienteArr{
  expediente?:           string;
  exp_sec?:             number;
  asu_codigo?:           string;
  nombre_asunto?:        string;
  exp_estado?:           string;
  territorial?:          string;
  ter_sec?:              number;
  ter_tipo_documento?:   string;
  ter_documento?:        string;
  ter_nombres?:          string;
  ter_direccion?:        string;
  ter_dir_municipio?:    string;
  ter_dir_depto?:        string;
  ter_email?:            string;
  ter_telefono?:         string;
  ter_celular?:          null;
  ter_naturaleza?:       string;
  ultima_autogestion?:   string;
  admite_autogestion?:   string;
  motivo_no_admite?:     string;
  respon_nombre?:        string;
  respon_correo?:        string;
  respon_telefono_fijo?: null;
  respon_telefono_celu?: string;
  respon_cargo?:         string;
 cc_responsable?:        string;
  blifirma?:             string;
}
