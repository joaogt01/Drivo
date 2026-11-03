export interface Vehicle {
  id: string;
  userId: string;
  brand: string;
  model: string;
  year: number;
  modelYear: number | null;
  plate: string | null;
  renavam: string | null;
  chassis: string | null;
  color: string | null;
  fuel: string | null;
  vehicleType: string | null;
  nickname: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/** Dados que o usuário pode informar. Todos opcionais (serve para criar e atualizar). */
export type VehicleDraft = Partial<
  Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
>;

const TRIMMED = [
  'brand',
  'model',
  'renavam',
  'color',
  'fuel',
  'vehicleType',
  'nickname',
] as const;

const UPPERCASED = ['plate', 'chassis'] as const;

/**
 * Regra de normalização que antes vivia em VehiclesService.normalizeVehicleData:
 * trim em textos e caixa alta em placa e chassi. Campos ausentes (undefined)
 * são descartados, para o update não sobrescrever o que não foi enviado.
 */
export function normalizeVehicleDraft<T extends VehicleDraft>(input: T): T {
  const out: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) out[key] = value;
  }

  for (const key of TRIMMED) {
    if (typeof out[key] === 'string') out[key] = (out[key] as string).trim();
  }

  for (const key of UPPERCASED) {
    if (typeof out[key] === 'string') {
      out[key] = (out[key] as string).trim().toUpperCase();
    }
  }

  return out as T;
}