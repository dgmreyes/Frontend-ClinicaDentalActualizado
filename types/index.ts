// src/types/index.ts

export interface Cita {
  id: number;
  documentId?: string; 
  Fecha: string;
  Hora: string; 
  Motivo_Consulta: string;
  Estado: 'Pendiente' | 'Confirmada' | 'Completada' | 'Cancelada';
  createdAt?: string;
  
  paciente?: Paciente;
  dentista?: Dentista;
  servicio?: Servicio;
}
export interface Dentista {
  id: number;
  documentId: string;
  nombre: string;
  apellido: string;
  Especialidad: string;
  telefono?: number;
}
export interface Servicio {
  id: number;
  documentId: string;
  Nombre_Servicio: string;
  Costo_base: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface ResumenClinico {
  id: number;
  documentId: string;
  Descripcion: string; 
  Fecha: string;  
 
}

export interface Expediente {
  id: number;
  documentId: string;
  Fecha_Creacion: string;
  estado: 'Activo' | 'Inactivo' | 'Archivado' | 'Tratamiento';
  resumen_clinicos: ResumenClinico[];
}

export interface Paciente {
  id: number;
  documentId: string;
  nombre: string;
  apellido: string;
  telefono: number;
  Direccion?: string; 
  expediente?: Expediente; 
  citas?: any[]; 
}