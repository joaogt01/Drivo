export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  plate: string;
  renavam: string;
  chassis: string;
  year: string;
  modelYear: string;
  color: string;
  fuel: string;
  type: string;
  nickname: string;
  image: string;
};

export const sampleVehicles: Vehicle[] = [
  {
    id: '1',
    brand: 'Toyota',
    model: 'Corolla Altis Hybrid',
    plate: 'RTX4B21',
    renavam: '01234567890',
    chassis: '9BRBC3E31P4821',
    year: '2022',
    modelYear: '2023',
    color: 'Prata',
    fuel: 'Híbrido',
    type: 'Automóvel',
    nickname: 'Carro da família',
    image:
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: '2',
    brand: 'Honda',
    model: 'HR-V EXL Turbo',
    plate: 'QPL8C34',
    renavam: '13579246801',
    chassis: '93H••••••0193',
    year: '2023',
    modelYear: '2024',
    color: 'Preto',
    fuel: 'Flex',
    type: 'SUV',
    nickname: '',
    image:
      'https://images.unsplash.com/photo-1519641476-a6b2d8b0e3b8?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: '3',
    brand: 'Volkswagen',
    model: 'Polo Highline TSI',
    plate: 'FHD2E09',
    renavam: '11223344556',
    chassis: '9BW••••••7740',
    year: '2021',
    modelYear: '2022',
    color: 'Branco',
    fuel: 'Flex',
    type: 'Automóvel',
    nickname: '',
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: '4',
    brand: 'Fiat',
    model: 'Toro Volcano Diesel',
    plate: 'GBN7A55',
    renavam: '98765432109',
    chassis: '988••••••3312',
    year: '2022',
    modelYear: '2022',
    color: 'Cinza',
    fuel: 'Diesel',
    type: 'Picape',
    nickname: '',
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: '5',
    brand: 'Yamaha',
    model: 'MT-03 ABS',
    plate: 'MXR1J78',
    renavam: '55667788990',
    chassis: '9C6••••••5521',
    year: '2020',
    modelYear: '2021',
    color: 'Azul',
    fuel: 'Gasolina',
    type: 'Motocicleta',
    nickname: '',
    image:
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=85',
  },
];

export function readVehicles(): Vehicle[] {
  if (typeof window === 'undefined') {
    return sampleVehicles;
  }

  try {
    const raw = localStorage.getItem('drivo-vehicles');
    return raw ? JSON.parse(raw) : sampleVehicles;
  } catch {
    return sampleVehicles;
  }
}

export function saveVehicles(items: Vehicle[]) {
  localStorage.setItem('drivo-vehicles', JSON.stringify(items));
}