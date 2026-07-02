# API Backend - Sistema de Gestión Universitaria y Publicaciones (MVC)

Este es un servidor backend robusto desarrollado con **Express** y **MongoDB (Mongoose)** enfocado en la gestión de alumnos, materias y publicaciones. Implementa autenticación basada en tokens JWT, control de accesos por niveles de roles (`ADMIN` / `USER`), validación estricta de esquemas en tiempo de ejecución con **Zod** y una arquitectura de salida limpia mediante un sistema centralizado de manejo de errores.

---

## 📎Estructura del Proyecto (Arquitectura MVC Modular)
El proyecto sigue el patrón **Modelo-Vista-Controlador** reflejado fielmente en el árbol de directorios del sistema:
*   `src/constants/`: Enums nativos para centralizar las carreras, roles (`ADMIN`/`USER`) y tipos de publicaciones.
*   `src/controllers/`: Lógica de negocio segmentada (Autenticación, Administración, Publicaciones, Materias y Perfil).
*   `src/middleware/`: Capa de seguridad, validadores de esquemas de Zod (`body` y `query`) y saneamiento universal de parámetros de ruta (`validarParamId`).
*   `src/models/`: Definición de esquemas relacionales y colecciones de Mongoose (`User`, `Publication`, `Subject`).
*   `src/routes/`: Enrutamiento modular segmentado por responsabilidades operativas y administrativas.
*   `src/utils/`: Clases de utilidad global para inyección de excepciones estructuradas (`AppError`).

---

## 📎 Características Técnicas Clave
1.  **Validación y Saneamiento Inmediato (Zod)**: Todos los datos entrantes del body son filtrados. Para los `Query Params` de las URLs, se implementó `z.coerce.number()` para transformar automáticamente las cadenas de texto a números enteros nativos con valores por defecto integrados.
2.  **Abstracción de Saneamiento de Parámetros**: Middleware universal `validarParamId` que intercepta IDs de MongoDB corruptos en las URLs antes de ejecutar consultas en la base de datos, mitigando excepciones innecesarias.
3.  **Manejo Centralizado de Errores**: Arquitectura global basada en una clase extendida `AppError` y un middleware de salida de 4 parámetros enlazado al final de Express. Elimina la redundancia de bloques `catch` manuales y unifica el formato JSON de fallos devueltos al cliente.
4.  **Operaciones Protegidas e Inyección Atómica**: Uso avanzado de operadores de persistencia como `$addToSet` para prevenir colecciones duplicadas. Mecanismos de protección que impiden el "autosuicidio" de cuentas administrativas.

---

## 📎 Instalación y Ejecución

1. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```
2. Crear un archivo `.env` en la raíz del proyecto tomando como plantilla el archivo `.env.example`:
   ```bash
   cp .env.example .env
   ```
#### 🔒 Configuración del Entorno de Seguridad (`NODE_ENV`)
El sistema utiliza la variable `NODE_ENV` para gestionar la seguridad de las excepciones en el **Manejo Centralizado de Errores**:
* **`NODE_ENV=development`**: Muestra la traza completa del error (`stack trace`) en la respuesta JSON para facilitar el *debugging* en Postman.
* **`NODE_ENV=production`**: Oculta automáticamente los detalles internos del código y carpetas del servidor ante errores imprevistos, evitando fugas de información (*Information Leakage*) y protegiendo la API contra atacantes.

3. Iniciar el servidor Express en modo desarrollo guiado por `nodemon`:
   ```bash
   npm run dev
   ```

---

## 📎 Colección de Pruebas (Ejemplos de Requests en Postman)

### 1. Módulo de Autenticación (Rutas Públicas)
*   **Registro de Usuario**
    *   **Método:** `POST`
    *   **URL:** `http://localhost:3005/api/register`
    *   **Body (JSON):**
        ```json
        {
          "nombre": "Danyel Salazar",
          "email": "danyel@example.com",
          "password": "Password123!",
          "materias": []
        }
        ```
*   **Inicio de Sesión (Login)**
    *   **Método:** `POST`
    *   **URL:** `http://localhost:3005/api/login`
    *   **Body (JSON):** Retorna el token JWT necesario para las rutas privadas.
        ```json
        {
          "email": "danyel@example.com",
          "password": "Password123!"
        }
        ```

### 2. Módulo de Perfil de Usuario (Privados - Rol USER / ADMIN)
*   **Obtener Datos de Mi Perfil**
    *   **Método:** `GET`
    *   **URL:** `http://localhost:3005/api/user`
    *   **Headers:** `Authorization: Bearer <JWT_TOKEN>`

*   **Actualizar Mis Datos de Perfil (PATCH)**
    *   **Método:** `PATCH`
    *   **URL:** `http://localhost:3005/api/user`
    *   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
    *   **Body (JSON):** `{"nombre": "Danyel Modificado"}`

*   **Inyectar Materia al Alumno (Sin Duplicados)**
    *   **Método:** `POST`
    *   **URL:** `http://localhost:3005/api/user/materia`
    *   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
    *   **Body (JSON):** `{"idMateria": "6a2b1d33abebca29ffc4eacc"}`

*   **Listar Mis Materias (Pobladas con Datos Reales)**
    *   **Método:** `GET`
    *   **URL:** `http://localhost:3005/api/user/materia`
    *   **Headers:** `Authorization: Bearer <JWT_TOKEN>`

*   **Eliminar Mi Propia Cuenta**
    *   **Método:** `DELETE`
    *   **URL:** `http://localhost:3005/api/user`
    *   **Headers:** `Authorization: Bearer <JWT_TOKEN>`

### 3. Módulo de Publicaciones (Privados - Rol USER / ADMIN)
*   **Crear Nueva Publicación**
    *   **Método:** `POST`
    *   **URL:** `http://localhost:3005/api/user/publication`
    *   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
    *   **Body (JSON):**
        ```json
        {
          "descripcion": "Hola a todos dejo info de base de datos II",
          "materia": "6a2b1d33abebca29ffc4eacc",
          "tipo": "APORTE"
        }
        ```

*   **Listar Publicaciones con Filtros Avanzados (Query Params Opcionales)**
    *   **Método:** `GET`
    *   **URL:** `http://localhost:3005/api/user/publications?tipo=APORTE&materia=base de datos II&page=1&limit=5`
    *   **Headers:** `Authorization: Bearer <JWT_TOKEN>`

### 4. Módulo de Materias / Subjects (Privados - Rol ADMIN)
*   **Creación de Materias**
    *   **Método:** `POST`
    *   **URL:** `http://localhost:3005/api/subject`
    *   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
    *   **Body (JSON):**
        ```json
        {
          "nombre": "Base de Datos II",
          "carreras": ["Sistemas", "Programacion"]
        }
        ```

### 5. Módulo de Administración Global (Privados - Exclusivo ADMIN)
*   **Listar Todos los Usuarios Paginados con Filtro de Rol**
    *   **Método:** `GET`
    *   **URL:** `http://localhost:3005/api/admin?page=1&limit=10&role=USER`
    *   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`

*   **Modificar Rol o Datos de un Usuario por ID (PATCH)**
    *   **Método:** `PATCH`
    *   **URL:** `http://localhost:3005/api/admin/6a2b1d33abebca29ffc4e111`
    *   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
    *   **Body (JSON):** `{"role": "ADMIN"}`

*   **Eliminar Cualquier Usuario por ID**
    *   **Método:** `DELETE`
    *   **URL:** `http://localhost:3005/api/admin/6a2b1d33abebca29ffc4e222`
    *   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
