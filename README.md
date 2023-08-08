# Prueba técnica para el cargo de Freelance Backend Developer

## Introducción

Este es un repositorio que contiene el código fuente de una prueba técnica para el cargo de Freelance Backend Developer en la empresa [AID FOR AIDS](https://www.aidforaidscolombia.org/quienes-somos/).

## Herramientas utilizadas

Para el desarrollo de esta prueba técnica se utilizaron las siguientes herramientas:

-   [Express](https://expressjs.com/es/): Framework de Node.js para el desarrollo de aplicaciones web.
-   [MongoDB](https://www.mongodb.com/es): Base de datos NoSQL.
-   [Mongoose](https://mongoosejs.com/): Librería de Node.js para el modelado de objetos de MongoDB.
-   [Jsonwebtoken](https://jwt.io/): Librería de Node.js para la generación de tokens de autenticación.
-   [Cloudinary](https://cloudinary.com/): Servicio de almacenamiento de imágenes en la nube.
-   [Jest](https://jestjs.io/): Framework de pruebas para JavaScript.
-   [Supertest](https://www.npmjs.com/package/supertest): Librería de Node.js para realizar pruebas HTTP.

## Instalación

Para instalar este proyecto en su computador, siga los siguientes pasos:

1. Clone este repositorio en su computador.
2. Instale las dependencias del proyecto con el comando `npm install` o `npm i`.
3. Cree un archivo `.env` en la raíz del proyecto y agregue las siguientes variables de entorno:

```
# Puede cambiar el valor de estas variables de entorno si lo desea

# Puerto en el que se ejecutará el servidor
PORT=3000

# URL de la base de datos de MongoDB
MONGODB_URI = "mongodb://localhost:27017/prueba-tecnica"
MONGODB_URI_TEST = "mongodb://localhost:27017/prueba-tecnica-test"

# Key secreta para la generación de tokens de autenticación
SECRET_KEY = "rKLumpH92V3"

# Si no cuenta con una cuenta de Cloudinary, puede utilizar la siguiente información
CLOUDINARY_CLOUD_NAME = "dcqoxtpxj"
CLOUDINARY_API_KEY = "636712958952759"
CLOUDINARY_API_SECRET = "nRG9vh_ZDRtTuEuS0HUI6RXs5Lc"
```

## Ejecución

Comandos disponibles:

-   `npm start`: Ejecuta el servidor en modo de producción.
-   `npm run dev`: Ejecuta el servidor en modo de desarrollo.
-   `npm run test`: Ejecuta las pruebas unitarias.
-   `npm run time`: Ver el tiempo de desarrollo del proyecto.
