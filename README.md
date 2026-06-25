# EventosVivos Frontend

Aplicación frontend para la gestión de eventos y reservas construida con Angular 22, Angular Material, Signals y formularios reactivos. El proyecto consume una API REST externa para administrar eventos, venues, reservas, confirmaciones de pago y cancelaciones.

## Resumen

La aplicación permite:

- Crear eventos con validaciones de negocio sobre capacidad, fechas y tipo.
- Listar eventos con filtros por título, tipo, estado, venue y rango de fechas.
- Consultar el detalle de un evento y su reporte de ocupación.
- Crear reservas para un evento con reglas de límite por tiempo y precio.
- Consultar reservas, confirmar pagos y cancelar reservas con mensajes de confirmación.
- Mostrar alertas y diálogos reutilizables para flujos críticos.

## Stack

- Angular 22
- TypeScript 6
- Angular Material 22
- RxJS 7
- SCSS
- Vitest a través del builder de Angular

## Funcionalidades Implementadas

### Eventos

- Creación de eventos con validación de título, descripción, precio, fechas y capacidad máxima.
- Validación dinámica de capacidad según el venue seleccionado.
- Conversión de fecha y hora a formato UTC antes de enviar al backend.
- Listado de eventos con filtros avanzados.
- Visualización del detalle del evento con indicadores de estado.
- Reporte de ocupación con porcentaje, ingresos y disponibilidad.

### Reservas

- Creación de reservas con validación de nombre, correo y cantidad.
- Cálculo automático del total a pagar.
- Límite de entradas por reglas de negocio:
  - máximo 5 entradas si faltan menos de 24 horas para el evento.
  - máximo 10 entradas si el evento cuesta más de 100.
  - máximo 100 entradas en el caso general.
- Pantalla de detalle de reserva con datos del comprador, código de reserva y resumen del evento.
- Confirmación de pago mediante diálogo de confirmación.
- Cancelación de reserva con advertencia especial si el evento inicia en menos de 48 horas.
- Listado de reservas desde la ruta de administración.

### Experiencia de usuario

- Navbar con accesos directos a eventos, creación y reservaciones.
- Alertas de éxito, error, advertencia e información mediante Angular Material Dialog.
- Componentes standalone en toda la aplicación.
- Uso de Signals para el estado local de vistas, carga y procesos.

## Rutas Disponibles

```text
/eventos
/eventos/crear
/eventos/:id
/eventos/:id/reservar
/reservas/:id
/reservaciones
```

## Estructura del Proyecto

```text
src/app/
├── core/
│   ├── models/
│   └── services/
├── features/
│   ├── events/
│   │   ├── event-create/
│   │   ├── event-detail/
│   │   └── event-list/
│   └── reservations/
│       ├── reservation-create/
│       ├── reservation-detail/
│       └── reservation-list/
├── shared/
│   ├── components/
│   │   ├── app-alert-dialog/
│   │   └── app-confirm-dialog/
│   ├── navbar/
│   └── utils/
├── app.config.ts
├── app.routes.ts
└── app.ts
```

## Requisitos

- Node.js 20 o superior.
- npm 10.8.2 o superior.
- Backend accesible por HTTPS para desarrollo local.

## Instalación y Ejecución

```bash
npm install
npm start
```

La aplicación queda disponible en `http://localhost:4200`.

## Scripts Útiles

```bash
npm start        # Desarrollo
npm run build    # Build por defecto
npm run build:prod
npm test         # Tests en watch
npm run test:ci  # Tests en una sola pasada
```

## Configuración de Entornos

### Desarrollo

Archivo: `src/environments/environment.ts`

```ts
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7248/api'
};
```

### Producción

Archivo: `src/environments/environment.prod.ts`

```ts
export const environment = {
  production: true,
  apiUrl: '/api'
};
```

Importante:

- En producción el frontend espera que la API esté expuesta bajo la misma raíz usando `/api`.
- Si se publica como sitio estático en GitHub Pages, esta configuración no funcionará sin cambiar `apiUrl` a una URL pública completa del backend o sin un proxy externo.

## Tests

La suite actual cubre servicios, formularios, flujos de componentes y reglas de negocio principales.

Ejecución recomendada para CI o validación local:

```bash
npm run test:ci
```

Estado validado del proyecto:

- 13 archivos de pruebas
- 55 pruebas pasando


## GitHub Actions

El workflow incluido ejecuta automáticamente en push y pull request:

- `npm ci`
- `npm run build:prod`
- `npm run test:ci`

## Despliegue

### Opción 1: repositorio en GitHub

Ya queda lista con documentación y CI.


