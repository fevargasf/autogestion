

export class StorageVariables {
    public static EXPEDIENTE_ACTUAL:string = "expedienteActual";
    public static SECUENCE_THIRD_PARTY:string = "sec";
    public static SECUENCE_THIRD_PARTY2:string = "expediente";

    public static expedienteActual():any{
        return JSON.parse(sessionStorage.getItem(StorageVariables.EXPEDIENTE_ACTUAL));
    }

    public static sequenceThirdParty():string{
        return JSON.parse(localStorage.getItem(StorageVariables.SECUENCE_THIRD_PARTY)).sequenceThirdParty;
    }
    public static sequenceThirdParty2():any{
        return JSON.parse(localStorage.getItem(StorageVariables.SECUENCE_THIRD_PARTY2)) | JSON.parse(localStorage.getItem(StorageVariables.SECUENCE_THIRD_PARTY2)).sequenceThirdParty2;
    }
}
export const allowK={
    key:'1234567890QXGjlm'
}
