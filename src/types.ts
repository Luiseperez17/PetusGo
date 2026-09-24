export interface TutorData {
  nombreCompleto: string;
  correo: string;
  telefono: string;
  direccion: string;
  cedula: string;
}

export interface MascotaData {
  nombre: string;
  peso: string;
  edad: string;
  tamano: 'pequeño' | 'mediano' | 'grande' | '';
  especie: 'canino' | 'felino' | '';
  sexo: 'macho' | 'hembra' | '';
  fechaDesparasitacion: string;
  fechaVacuna: string;
  esterilizado: 'si' | 'no' | '';
  fotoUrl?: string;
}

export interface RegistroForm {
  tutor: TutorData;
  mascota: MascotaData;
  aceptaTerminos: boolean;
}

export interface MemberProfile {
  id: string;
  fechaRegistro: string;
  vigenciaHasta: string;
  tutor: TutorData;
  mascota: MascotaData;
  plan5mas1Compras: number; // 0 to 5
  descuentoFarmaciaActivo: boolean;
  banoGratisDisponible: boolean;
  consultaMedicaDisponible: boolean;
}

export type ScreenMode = 'landing' | 'carnet' | 'simulador' | 'calculadora';
