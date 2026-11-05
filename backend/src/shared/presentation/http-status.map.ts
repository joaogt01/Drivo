/**
 * Mapeia código de erro de domínio -> status HTTP.
 * Código não mapeado responde 400.
 */
export const DOMAIN_ERROR_STATUS: Record<string, number> = {
  VEHICLE_NOT_FOUND: 404,
  VEHICLE_CONFLICT: 409,    
};