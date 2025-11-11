# Oliva Reads - Backend (Laravel)

Este directorio contiene el backend de la aplicación Oliva Reads, construido con Laravel.

## Plan de Acción: Paso 1 - Configuración del Entorno

¡Hemos empezado! Este es el esqueleto de nuestro backend. Para ponerlo en marcha, sigue estos pasos.

### Prerrequisitos

Asegúrate de tener instalado en tu sistema:
- **PHP** (versión ^8.2 o superior)
- **Composer** (gestor de dependencias de PHP)
- Una base de datos (ej. **MySQL**, MariaDB, o PostgreSQL)
- **Node.js** y **npm** (opcional para este paso, pero necesario para Laravel en general)

### Guía de Instalación

1.  **Navega al Directorio del Backend:**
    Abre tu terminal y asegúrate de estar en el directorio `backend/`.
    ```bash
    cd backend
    ```

2.  **Instala las Dependencias de PHP:**
    Composer leerá el archivo `composer.json` y descargará todas las librerías necesarias, incluyendo el framework de Laravel.
    ```bash
    composer install
    ```

3.  **Crea tu Archivo de Entorno:**
    Copia el archivo de ejemplo `.env.example` para crear tu propio archivo de configuración local `.env`. Laravel lo usará para cargar variables importantes como las credenciales de la base de datos.
    ```bash
    cp .env.example .env
    ```

4.  **Genera la Clave de la Aplicación:**
    Laravel necesita una clave de encriptación única para asegurar las sesiones y otros datos. Este comando la generará y la guardará en tu archivo `.env`.
    ```bash
    php artisan key:generate
    ```

5.  **Configura tu Base de Datos:**
    - Abre el archivo `.env` que acabas de crear.
    - Crea una base de datos en tu gestor (ej. MySQL) llamada `olivareads` (o el nombre que prefieras).
    - Actualiza las siguientes líneas en `.env` con tus credenciales:
      ```
      DB_CONNECTION=mysql
      DB_HOST=127.0.0.1
      DB_PORT=3306
      DB_DATABASE=olivareads
      DB_USERNAME=root // Tu usuario de la base de datos
      DB_PASSWORD=    // Tu contraseña de la base de datos
      ```

6.  **Configura la Clave de API de Gemini:**
    - En el mismo archivo `.env`, busca la línea `GEMINI_API_KEY=` y añade tu clave de API de Google Gemini. Esta clave se mantendrá segura en el servidor.

7.  **Inicia el Servidor de Desarrollo:**
    ¡Ya casi está! Inicia el servidor de desarrollo de Laravel. Por defecto, se ejecutará en el puerto 8000.
    ```bash
    php artisan serve
    ```

8.  **Verifica la Instalación:**
    Abre tu navegador o una herramienta como Postman y ve a `http://127.0.0.1:8000/api/status`. Deberías ver una respuesta JSON como esta:
    ```json
    {
      "status": "API is running"
    }
    ```

### ¡Éxito!

Si has llegado hasta aquí, ¡felicidades! Has configurado con éxito el entorno del backend. El servidor está en marcha y listo para que empecemos a construir la lógica de la base de datos y los endpoints de la API en el siguiente paso.
