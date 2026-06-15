# TP 2 - Backend: Servidor Express con MongoDB y Autenticación JWT

## Descripción del Proyecto
Este proyecto es una API REST desarrollada con **Node.js** y **Express**, integrada con una base de datos **MongoDB** a través de **Mongoose**. Implementa el patrón de arquitectura **MVC (Modelo-Vista-Controlador)** y cuenta con un sistema robusto de autenticación segura utilizando **JSON Web Tokens (JWT)** y encriptación de contraseñas con **bcrypt** (gestionado mediante middlewares `pre('save')` en el modelo).

Adicionalmente, el servidor cuenta con una capa estricta de validación de datos en tiempo de ejecución implementada con **Zod**, lo que garantiza que las solicitudes HTTP entrantes estén limpias de datos basura y cumplan con las reglas de negocio antes de interactuar con la base de datos.

---

## Tecnologías Utilizadas
*   **Node.js** & **Express** (Servidor HTTP y enrutamiento)
*   **MongoDB** & **Mongoose** (Base de datos NoSQL y ODM)
*   **jsonwebtoken (JWT)** (Autenticación y manejo de sesiones)
*   **bcrypt** (Hasheo seguro de contraseñas)
*   **Zod** (Validación y tipado de esquemas del body)
*   **dotenv** (Gestión segura de variables de entorno)

---

## Estructura del Proyecto (Arquitectura MVC)
```text
├── src/
│   ├── controllers      #logica de negocio
│   ├── db/              # conexion a la base de datos
│   ├── middleware/      # Middlewares (Auth JWT y validaciones Zod)
│   ├── models/          # Modelos de Mongoose (Schemes)
│   ├── routes/          # Definición de Endpoints (Rutas)
│   └── app.js           # Punto de entrada del servidor
├── .env.example         # Plantilla de variables de entorno
├── package.json         # Dependencias y scripts
└── README.md            # Documentación del proyecto
```

---

## Instrucciones de Instalación y Ejecución

### 1. Clonar el repositorio e instalar dependencias
Asegúrate de tener Node.js instalado. Abre tu terminal en la raíz del proyecto y ejecuta:
```bash
npm install
```

### 2. Configurar las Variables de Enorno
Crea un archivo llamado `.env` en la raíz del proyecto basándote en la plantilla `.env.example`. Debe contener las siguientes variables:
```env
PORT=3005
MONGO_URI=mongodb://localhost:27017/tu_base_de_datos
JWT_SECRET=una_clave_secreta_muy_larga_y_segura_para_el_token_123
```

### 3. Ejecutar el Servidor
```bash
npm run dev
```
Deberías ver los mensajes: 
`Servidor corriendo en http://localhost:....` y `Mongo conectado!!`.

---

## Guía de Endpoints y Ejemplos de Requests

### 1. Autenticación (Rutas Públicas)

#### **POST** `/api/user/auth/register` (Registro de Usuario)
*   **Descripción:** Registra un nuevo usuario en el sistema.
*   **Cuerpo (JSON) Obligatorio:**
```json
{
  "nombre": "Danyel Salazar",
  "email": "danyel@gmail.com",
  "password": "PasswordSegura123!",
}
```

#### **POST** `/api/user/auth/login` (Inicio de Sesión)
*   **Descripción:** Autentica las credenciales y devuelve el Token JWT que expira en 1 hora.
*   **Cuerpo (JSON) Obligatorio:**
```json
{
  "email": "danyel@mail.com",
  "password": "PasswordSegura123!"
}
```
*   **Respuesta Exitosa (200 OK):** Devuelve un objeto con la propiedad `token`. Copia este valor para las rutas protegidas.

---

### 2. Gestión de Usuario y Perfil (Rutas Privadas)
*Nota: Todas estas rutas requieren la cabecera `Authorization: Bearer <TU_TOKEN_JWT>`.*

#### **GET** `/api/user` (Obtener Perfil Logueado)
*   **Descripción:** Devuelve la información completa del usuario actual de forma segura (la contraseña está excluida de la consulta).

#### **PATCH** `/api/user` (Actualizar Perfil de Forma Parcial)
*   **Descripción:** Modifica los campos que envíes en el cuerpo sin alterar los demás. Zod filtra y elimina cualquier campo inválido automáticamente.
*   **Cuerpo (JSON) Opcional:**
```json
{
  "nombre": "Danyel Salazar Alarcon",
  "materias": [
    "6a2b1d33abebca29ffc4eacc"
  ]
}
```

Para actualizar solo el arreglo de materias del usuario: 
```json
{
  "materias": [
    "6a2b1d33abebca29ffc4eacc"
  ]
}
```

#### **DELETE** `/api/users` (Eliminar Cuenta)
*   **Descripción:** Realiza un borrado físico permanente de la cuenta asociada al token activo.

---

### 3. Gestión de Materias / Entidad Asociada (Rutas Privadas)
*Nota: Requieren la cabecera `Authorization: Bearer <TU_TOKEN_JWT>`.*

#### **POST** `/api/user/materia` (Inscribir Materia a Usuario)
*   **Descripción:** Vincula una materia existente al arreglo del usuario. Utiliza el operador `$addToSet` para evitar registros duplicados.
*   **Cuerpo (JSON) Obligatorio:**
```json
{
  "idMateria": "6a2b1d33abebca29ffc4eacc"
}
```

#### **GET** `/api/users/materias` (Listar Materias del Usuario)
*   **Descripción:** Devuelve el arreglo completo de materias del alumno logueado utilizando el método `.populate()` para transformar los IDs en objetos detallados, optimizando la respuesta con `.select()`.

---

### 4. Gestión de Materias (Entidad Asociada)

#### **POST** `/api/subjects` (Creación Global de Materia)
*   **Descripción:** Registra una nueva materia en el sistema general (utiliza de Zod para validar el nombre y el arreglo de carreras autorizadas).
*   **Cuerpo (JSON) Obligatorio:**
```json
{
  "nombre": "Base de Datos I",
  "carreras":[
    "Licenciatura en Informatica"
  ]
}
```

### Proximo : agregar PATCH y DELETE para las materias del usaurio
---

## Pruebas Automatizadas (Postman / Thunder Client)
Se adjunta en la raíz del proyecto el archivo `coleccion_pruebas.json` que contiene todas las peticiones listas para importar. 

1. Abre **Postman**.
2. Haz clic en **Import** y selecciona el archivo `.json`.
3. Ejecuta primero la petición de regrar y luego login para crear el token y ese token se lo pones a las peticiones que tienen Bearer en el header


---

## Próximas Implementaciones
El proyecto se encuentra en desarrollo activo y próximamente se integrarán las siguientes funcionalidades de interacción social dentro de la plataforma:

*   **Colección de Publicaciones**: Creación de un modelo `Publicacion` para que los usuarios puedan realizar posts asociados a su perfil mediante relaciones de Mongoose (`ObjectId`).
*   **Sistema de Interacción (Likes / Unlikes)**: Lógica en controladores utilizando el operador de actualización `$addToSet` para permitir dar "Me gusta" de forma única por usuario y `$pull` para remover el voto, controlando la integridad de los datos en tiempo real.
