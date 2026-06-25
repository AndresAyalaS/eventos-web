function normalizeDate(value: Date): Date {
  return new Date(value.getTime());
}

function startOfDay(value: Date): Date {
  const date = normalizeDate(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function withTime(value: Date, hora: string): Date {
  const [hh, mm] = hora.split(':').map(Number);
  const date = normalizeDate(value);
  date.setHours(hh, mm, 0, 0);
  return date;
}

export function combineDateAndTime(fecha: Date, hora: string): Date {
  return withTime(fecha, hora);
}

export function isFutureDate(fecha: Date): boolean {
  return startOfDay(fecha).getTime() >= startOfDay(new Date()).getTime();
}

export function isAfterDateTime(
  fechaInicio: Date,
  horaInicio: string,
  fechaFin: Date,
  horaFin: string,
): boolean {
  const inicio = withTime(fechaInicio, horaInicio);
  const fin = withTime(fechaFin, horaFin);

  return fin.getTime() > inicio.getTime();
}

export function toUtcString(fecha: Date, hora: string): string {
  return withTime(fecha, hora).toISOString();
}
