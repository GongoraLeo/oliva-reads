# Oliva Reads - Backend (Laravel)

Este directorio contiene el backend de la aplicación Oliva Reads, construido con Laravel.

## Guía de Instalación y Configuración

Sigue estos pasos para poner en marcha el servidor de backend localmente.

### Prerrequisitos

- **PHP** (^8.2 o superior)
- **Composer**
- Una base de datos (ej. **MySQL**)

---

### Paso 1: Crear el Proyecto y Configurar el Entorno

1.  **Crea el Proyecto Laravel:**
    Desde el directorio raíz de tu proyecto (fuera de `backend`), ejecuta el siguiente comando. Esto creará una nueva carpeta `backend` con la última versión de Laravel.
    ```bash
    composer create-project laravel/laravel backend
    ```

2.  **Navega al Directorio del Backend:**
    ```bash
    cd backend
    ```

3.  **Habilita la API y Sanctum:**
    Laravel 11 requiere que habilitemos las rutas de API explícitamente.
    ```bash
    php artisan install:api
    ```
    Cuando te pregunte si quieres instalar Sanctum, escribe `yes` y presiona Enter.

4.  **Configura el Archivo de Entorno (`.env`):**
    Crea tu archivo de configuración local a partir de la plantilla.
    ```bash
    cp .env.example .env
    ```

5.  **Genera la Clave de la Aplicación:**
    ```bash
    php artisan key:generate
    ```

6.  **Actualiza tu `.env`:**
    Abre el archivo `backend/.env` y configura lo siguiente:
    - **Base de Datos:** Asegúrate de que las credenciales `DB_DATABASE`, `DB_USERNAME`, y `DB_PASSWORD` son correctas.
    - **Clave de Gemini:** Añade tu clave de API: `GEMINI_API_KEY=tu_clave_aqui`
    - **Sanctum:** Asegúrate de que esta línea exista para la conexión con el frontend: `SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000`

7.  **Habilita las Rutas de API en la Configuración:**
    Abre el archivo `backend/bootstrap/app.php`. Localiza el bloque `->withRouting(...)` y asegúrate de que la línea `api:` esté presente:
    ```php
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php', // <-- Asegúrate de que esta línea existe
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ```

---

### Paso 2: Crear la Estructura de la Base de Datos

1.  **Ejecuta las Migraciones:**
    Ahora que tienes todos los archivos de migración en `database/migrations/`, ejecuta el siguiente comando para crear todas las tablas en tu base de datos.
    **Nota:** `migrate:fresh` eliminará todas las tablas existentes y las volverá a crear. Es seguro usarlo durante el desarrollo.
    ```bash
    php artisan migrate:fresh
    ```

2.  **Inicia el Servidor:**
    ```bash
    php artisan serve
    ```

3.  **Verifica la Instalación (Opcional):**
    Abre tu navegador y ve a `http://127.0.0.1:8000/api/status` para confirmar que el servidor sigue funcionando.

### ¡Éxito!
El backend está configurado, la base de datos está estructurada y el servidor está listo para el siguiente paso: construir los endpoints de la API.