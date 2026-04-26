/**
 * Configuración centralizada de variables de entorno
 *
 * Las variables se leen desde el entorno de Vite (prefijo VITE_).
 * Copia .env.example a .env y completa los valores reales.
 *
 */

export const employeeLabel: string = "Empleado";
export const maxEmployees: number = 5;
export const ROLES = {
  CAMARERO: "camarero",
  CLIENTE: "cliente",
  COORDINADOR: "coordinador",
};