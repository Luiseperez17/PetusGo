import { MemberProfile } from '../types';

export const SAMPLE_MEMBER: MemberProfile = {
  id: 'PG-2025-9482',
  fechaRegistro: '15/01/2025',
  vigenciaHasta: '15/01/2026',
  tutor: {
    nombreCompleto: 'Camila Rodriguez',
    correo: 'camila.rodriguez@email.com',
    telefono: '+57 312 456 7890',
    direccion: 'Av. Las Palmas #45-12, Apto 502',
    cedula: '1098745231'
  },
  mascota: {
    nombre: 'Max',
    peso: '12.5',
    edad: '3 años',
    tamano: 'mediano',
    especie: 'canino',
    sexo: 'macho',
    fechaDesparasitacion: '10/08/2025',
    fechaVacuna: '25/06/2025',
    esterilizado: 'si',
    fotoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'
  },
  plan5mas1Compras: 3,
  descuentoFarmaciaActivo: true,
  banoGratisDisponible: true,
  consultaMedicaDisponible: true
};

export const PET_FOOD_BRANDS = [
  { id: 'rc', name: 'Royal Canin', presentations: ['3 kg', '7.5 kg', '15 kg'], basePrice: 192000 },
  { id: 'hills', name: 'Hill\'s Science Diet', presentations: ['2.5 kg', '7 kg', '14 kg'], basePrice: 208000 },
  { id: 'proplan', name: 'Purina Pro Plan', presentations: ['3 kg', '7.5 kg', '15 kg'], basePrice: 180000 },
  { id: 'taste', name: 'Taste of the Wild', presentations: ['2 kg', '5.6 kg', '12.2 kg'], basePrice: 224000 },
  { id: 'monge', name: 'Monge Natural Superpremium', presentations: ['2.5 kg', '12 kg'], basePrice: 168000 }
];

export const PHARMACY_PRODUCTS = [
  { id: 'bravecto', name: 'Bravecto Antiparasitario (1 tableta masticable - 3 meses)', category: 'Antiparasitario', normalPrice: 152000 },
  { id: 'nexgard', name: 'NexGard Spectra (Protección mensual completa)', category: 'Antiparasitario', normalPrice: 98000 },
  { id: 'condrovet', name: 'Condrovet Force HA (Salud Articular 120 comp.)', category: 'Suplemento', normalPrice: 168000 },
  { id: 'omega3', name: 'Aceite de Salmón Puro Omega 3 & 6 (500ml)', category: 'Nutrición', normalPrice: 84000 },
  { id: 'shampoo', name: 'Shampoo Antiséptico & Dermatológico (250ml)', category: 'Cuidado & Piel', normalPrice: 66000 },
  { id: 'colirio', name: 'Gotas Oftálmicas Lubricantes Veterinarias', category: 'Oftalmología', normalPrice: 56000 }
];

export const DEMO_PET_PHOTOS = [
  {
    name: 'Max (Beagle)',
    url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Luna (Golden Retriever)',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Rocky (Border Collie)',
    url: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Milo (Gato Siamés)',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80'
  }
];
