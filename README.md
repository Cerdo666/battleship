# Battleship Game

Juego de encontrar la flota (variante no-bélica del Hundir la Flota). Un jugador contra el servidor.

## Estructura del Proyecto

```
battleship/
├── server/     → API REST en Laravel + Sanctum
├── client/     → Frontend en React (Vite)
└── README.md
```

---

## BACK - Requisitos

- PHP >= 8.2
- Composer
- XAMPP (Apache + MySQL)
- Laravel 

---

## BACK - Instalación

### 1. Crear el proyecto Laravel

```bash
cd server
composer install
```

### 2. Copiar los archivos del back

Copia los archivos de la carpeta `server/` de este repositorio al proyecto recién creado (sobrescribe los que correspondan).

### 3. Instalar Sanctum

```bash
php artisan install:api
```

> Cuando te pregunte si ejecutar las migraciones, responde **no** por ahora.

### 4. Configurar el .env

Copia `.env.example` a `.env` y ajusta:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=battleship
DB_USERNAME=root
DB_PASSWORD=
```

### 5. Crear la base de datos

Abre **phpMyAdmin** (http://localhost/phpmyadmin) y crea una base de datos llamada `battleship`.

### 6. Generar la clave de la aplicación y migrar

```bash
php artisan key:generate
php artisan migrate
```

### 7. Arrancar el servidor

```bash
php artisan serve
```

La API estará disponible en: `http://127.0.0.1:8000/api`

---

## Endpoints de la API

### Públicos (no requieren token)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/status` | Health check |
| POST | `/api/register` | Registrar usuario |
| POST | `/api/login` | Login |
| GET | `/api/ranking` | Top 10 jugadores |

### Privados (requieren `Authorization: Bearer {token}`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/logout` | Cerrar sesión |
| GET | `/api/profile` | Ver perfil |
| PUT | `/api/change-password` | Cambiar contraseña |
| POST | `/api/game/start` | Iniciar partida |
| POST | `/api/game/shoot` | Disparar `{ row, col }` |
| DELETE | `/api/game/abandon` | Abandonar partida |
| GET | `/api/game/state` | Estado de partida activa |

### Ejemplos con Postman

**Registro:**
```json
POST /api/register
{
  "nickname": "jugador1",
  "password": "secreto123",
  "password_confirmation": "secreto123"
}
```

**Login:**
```json
POST /api/login
{
  "nickname": "jugador1",
  "password": "secreto123"
}
```

**Disparar (con token):**
```
Header: Authorization: Bearer {access_token}
POST /api/game/shoot
{
  "row": 3,
  "col": 4
}
```

---

## Reglas del Juego

- Tablero de **10x10**
- **5 barcos** colocados aleatoriamente al iniciar partida:
  - Carrier: 5 celdas
  - Battleship: 4 celdas
  - Cruiser: 3 celdas
  - Submarine: 3 celdas
  - Destroyer: 2 celdas
- El jugador gana encontrando los 5 barcos
- **Sistema de puntos:** `100- disparos`
- Solo usuarios con puntos > 0 aparecen en el ranking
- No se puede cerrar sesión con una partida activa

---

## FRONT - Instalación

```bash
cd client
bun install
bun add bootstrap
bun run dev
```

> El frontend corre en `http://localhost:5173` por defecto.

---

## CORS

El back ya tiene CORS configurado en `config/cors.php` para aceptar peticiones desde `localhost:5173`. Si cambias el puerto del front, actualiza ese archivo.

El frontend debe incluir el token en todas las peticiones privadas:

```javascript
fetch('http://127.0.0.1:8000/api/profile', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})
```





TO handle server error:
SQLSTATE[42S02]: Base table or view not found: 1146 Table 'battleship.sessions' doesn't exist (Connection: mysql, Host: 127.0.0.1, Port: 3306, Database: battleship, SQL: select * from sessions where id = ffKOVRsYC0vIcCmsMoxVhVq4ZIgL922o6pnAhdVH limit 1)

CREATE TABLE sessions;


´´´php 
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
    }
};
´´´