export interface UsuarioRecuperado{

   sequenceThirdParty2: number;
   sequenceThirdParty:  number;
   nombre:              string;
   correo:              string;
   telefonoCelular:     string;
   cargo:               string;

}

export interface UsuarioNatural{
  cc_responsable:      string;
  sequenceThirdParty2: string | number;
  sequenceThirdParty:  string | number;
  nombre:              string;
  correo:              string;
  telefonoCelular:     string;
  cargo:               string;
};
