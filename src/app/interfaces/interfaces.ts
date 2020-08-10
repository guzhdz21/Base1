import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

export interface AlertaGeneral {
    titulo: string;
    mensaje: string;
}

export interface Usuario {
    contraseña: string;
    nacimiento: Timestamp;
    nombre: string;
    numero: number;
    tipo: string;
    fechaDeIngreso: Date;
    domicilio: string;
    CURP: string;
    RFC: string;
    NSS: string;
    papeleria: boolean;
}

export interface Seguridad {
    numero: number;
    servicios: Asignacion[];
    supervisor: number;
}

export interface recursosHumanos {
    numero: number;
}

export interface Asignacion {
    dia: string;
    servicio: ServicioA
}

export interface Asistencia {
    dia: Timestamp;
    fotos: {
        imagenP: string;
        iamgenL: string;
    }
    horario: Hora;
    numero: number;
    servicio: ServicioA;
    retardo: boolean;
    valido: boolean;
}

export interface Cliente {
    nombre: string;
    servicios: Servicio[];
}

export interface Servicio {
    nombre: string;
    numero: number;
}

export interface ServicioA {
    cliente: string;
    servicio: number;
    horario: Hora;
    tipo: number;
}

export interface Hora {
    hora: number;
    minutos: number;
}

export interface Dispositivo {
    numero: number;
    token: string;
}

export interface Incidente {
    numero: number;
    nombre: string;
    servicio: string;
    titulo: string;
    descripcion: string;
    hora: Hora;
}

export interface Supervisor {
    numero: number;
    alertas: Incidente[];
}
