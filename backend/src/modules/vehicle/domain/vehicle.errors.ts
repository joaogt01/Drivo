import { DomainError } from '../../../shared/domain/domain-error';

export class VehicleNotFoundError extends DomainError {
  readonly code = 'VEHICLE_NOT_FOUND';

  constructor() {
    super('Veículo não encontrado.');
  }
}

export class VehicleConflictError extends DomainError {
  readonly code = 'VEHICLE_CONFLICT';

  constructor() {
    super('A placa, o Renavam ou o chassi informado já está cadastrado.');
  }
}