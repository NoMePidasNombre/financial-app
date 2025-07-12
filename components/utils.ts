// Convierte un string con coma decimal a número JS válido
export function parseDecimalInput(input: string): number {
  if (!input) return NaN;
  // Reemplaza la coma por punto para parsear
  return Number(input.replace(',', '.'));
}

// Valida si el string es un número real positivo con coma o punto
export function isValidDecimalInput(input: string): boolean {
  if (!input) return false;
  // Permite solo dígitos, una coma o punto, y opcionalmente decimales
  const regex = /^\d+(,\d{0,2})?$/;
  return regex.test(input);
}
