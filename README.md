# Sistema de Gestión de Cuenta Bancaria Simplificada

Proyecto Full-Stack para la asignatura **Ingeniería Web**.

**Integrante:** Sánchez Quispe, Kevin Joseph Pedro

La aplicación permite consultar el saldo de una cuenta, realizar depósitos, retiros y transferencias, y visualizar un historial de movimientos persistido en MongoDB local.

## Tecnologías

### Backend
- Node.js
- Express.js
- JavaScript ES6+
- MongoDB local
- Mongoose

### Frontend
- React
- Vite
- JavaScript + JSX
- `useState` y `useEffect`
- Tailwind CSS

## Estructura

```text
cuenta-bancaria-fullstack/
├── client/
│   └── src/
│       ├── components/
│       ├── services/
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   └── server.js
├── .gitignore
└── README.md
```

## Requisitos previos

- Node.js 20 o superior.
- npm.
- MongoDB instalado localmente.
- MongoDB configurado como **replica set de un solo nodo** para permitir transacciones atómicas.

> La transferencia actualiza dos cuentas y registra el movimiento dentro de una transacción de MongoDB. Por eso se utiliza un replica set local.

## 1. Configurar MongoDB local para transacciones

Si ya tienes un replica set local funcionando, puedes omitir esta sección.

Una forma común es iniciar MongoDB con un replica set llamado `rs0`:

```bash
mongod --dbpath RUTA_A_TU_DB --replSet rs0
```

Luego abre otra terminal:

```bash
mongosh
```

Y ejecuta una sola vez:

```js
rs.initiate()
```

Comprueba el estado con:

```js
rs.status()
```

La URI usada por este proyecto es:

```text
mongodb://127.0.0.1:27017/cuenta_bancaria?replicaSet=rs0
```

Si MongoDB se ejecuta como servicio en Windows, también puedes añadir `replSetName: rs0` en la sección `replication` de `mongod.cfg`, reiniciar el servicio y ejecutar `rs.initiate()` desde `mongosh`.

## 2. Backend

Entra a la carpeta:

```bash
cd server
```

Instala dependencias:

```bash
npm install
```

Copia `.env.example` como `.env`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/cuenta_bancaria?replicaSet=rs0
CLIENT_URL=http://localhost:5173
```

Carga cuentas y movimientos de prueba:

```bash
npm run seed
```

Inicia la API:

```bash
npm run dev
```

La API quedará disponible en:

```text
http://localhost:3000
```

## 3. Frontend

En otra terminal:

```bash
cd client
npm install
```

Copia `.env.example` como `.env`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_CUENTA_ID=690000000000000000000001
```

Inicia Vite:

```bash
npm run dev
```

Abre la URL mostrada por Vite, normalmente:

```text
http://localhost:5173
```

## Cuentas de prueba

El seed crea las siguientes cuentas:

| Número de cuenta | Titular | Saldo inicial |
| --- | --- | ---: |
| `001-000001` | Sánchez Quispe, Kevin Joseph Pedro | S/ 2,500.00 |
| `001-000002` | Ana Torres Mendoza | S/ 1,800.00 |
| `001-000003` | Luis Ramírez Soto | S/ 3,200.00 |
| `001-000004` | María López Castro | S/ 950.00 |

La interfaz usa `001-000001` como cuenta principal. Las otras cuentas sirven para probar transferencias.

## Endpoints requeridos

### Obtener cuenta y saldo

```http
GET /api/cuenta/:id
```

### Depósito

```http
POST /api/cuenta/deposito
Content-Type: application/json
```

```json
{
  "cuentaId": "690000000000000000000001",
  "monto": 200
}
```

### Retiro

```http
POST /api/cuenta/retiro
Content-Type: application/json
```

```json
{
  "cuentaId": "690000000000000000000001",
  "monto": 100
}
```

### Transferencia

```http
POST /api/cuenta/transferencia
Content-Type: application/json
```

```json
{
  "cuentaOrigenId": "690000000000000000000001",
  "cuentaDestino": "001-000002",
  "monto": 150
}
```

### Historial

```http
GET /api/cuenta/:id/historial
```

## Códigos HTTP manejados

- `200`: consulta realizada correctamente.
- `201`: operación bancaria registrada correctamente.
- `400`: datos inválidos, monto no válido, saldo insuficiente o transferencia a la misma cuenta.
- `404`: cuenta origen/destino no encontrada.
- `500`: error interno del servidor o problema de configuración/conexión.

## Validaciones implementadas

- Los montos deben ser mayores que cero.
- No se permiten retiros por encima del saldo disponible.
- No se permiten transferencias por encima del saldo disponible.
- La cuenta destino debe existir.
- La cuenta origen y destino no pueden ser la misma.
- El backend vuelve a validar todas las reglas aunque el frontend ya las haya comprobado.
- Las transferencias se ejecutan dentro de una transacción de MongoDB para evitar actualizaciones parciales.

## Gestión de estado en React

La aplicación utiliza:

- `useState` para cuenta, historial, formularios, operación activa, carga y mensajes.
- `useEffect` para cargar saldo e historial al iniciar.
- Props y callbacks para comunicar `App.jsx` con los componentes.
- Actualización automática de saldo e historial después de cada operación, sin recargar la página.

## Tailwind CSS

El diseño utiliza clases utilitarias de Tailwind para:

- layout responsive;
- tarjetas y paneles;
- estados hover/disabled;
- alertas de éxito/error;
- indicador de carga;
- adaptación a pantallas móviles y de escritorio.

No se utiliza un framework visual adicional.

## Pruebas rápidas sugeridas

1. Ejecutar el seed.
2. Abrir la aplicación y comprobar saldo e historial.
3. Depositar `S/ 100` y comprobar actualización inmediata.
4. Retirar un monto válido.
5. Intentar retirar más dinero que el saldo y comprobar el error `400`.
6. Transferir a `001-000002` y comprobar que el saldo e historial cambian.
7. Intentar transferir a una cuenta inexistente y comprobar el error `404`.
8. Intentar transferir a `001-000001` y comprobar la validación.
9. Revisar las colecciones `cuentas` y `transaccions` en MongoDB/Compass.

## Reiniciar datos de prueba

Puedes restaurar los datos iniciales en cualquier momento con:

```bash
cd server
npm run seed
```

## Ejecución rápida

Una vez configurado MongoDB como replica set y creados los archivos `.env`, puedes iniciar el proyecto con este orden:

```text
Terminal 1 → MongoDB local con replica set rs0
Terminal 2 → cd server && npm run seed
Terminal 3 → cd server && npm run dev
Terminal 4 → cd client && npm run dev
```

Después abre `http://localhost:5173` y realiza las pruebas funcionales.

## Comportamiento ante errores y sincronización

- Si la carga inicial falla, la interfaz muestra un estado de error con botón **Reintentar**.
- Si una operación bancaria se completa pero falla la actualización posterior del historial, la interfaz conserva el saldo devuelto por la operación y muestra un aviso para **Reintentar sincronización**.
- Un cuerpo JSON mal formado recibe respuesta HTTP `400` en vez de tratarse como error interno `500`.
- El historial muestra tipo, monto, fecha y las cuentas de origen/destino correspondientes a cada movimiento.

## Nota sobre los datos del seed

Los movimientos precargados son coherentes con los saldos actuales de las cuatro cuentas. Se incluyen depósitos iniciales y operaciones posteriores para que el historial pueda utilizarse durante la demostración sin comenzar vacío.
