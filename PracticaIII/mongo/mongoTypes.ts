export interface TaskSchema {
  _id: { $oid: string };
  id: number;
  nombre: string;
  descripcion?: string;
  fechaDeFinalizacion: Date;
  state: string;
}