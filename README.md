# Technical test for the position of Freelance Backend Developer at AID FOR AIDS

## Introduction

This is a repository that contains the source code of a technical test for the position of Freelance Backend Developer at [AID FOR AIDS](https://www.aidforaidscolombia.org/quienes-somos/).

## Technologies Used

For the development of this technical test the following tools were used:

-   [Express](https://expressjs.com/): Node.js framework for web application development.
-   [Zod](https://zod.dev): TypeScript-first schema declaration and validation library.
-   [MongoDB](https://www.mongodb.com/es): NoSQL database.
-   [Mongoose](https://mongoosejs.com/): Node.js library for modeling MongoDB objects.
-   [Jsonwebtoken](https://jwt.io/): Node.js library for generating authentication tokens.
-   [Cloudinary](https://cloudinary.com/): Cloud image storage service.
-   [Jest](https://jestjs.io/): JavaScript testing framework.
-   [Supertest](https://www.npmjs.com/package/supertest): Node.js library for performing HTTP tests.

## Installation

For install this project in your computer, follow the next steps:

1. Clone this repository in your computer.
2. Install the project dependencies with the command `npm install` or `npm i`.
3. Create a `.env` file in the root of the project and add the following environment variables:

```
# You can change the value of these environment variables if you want

# Port on which the server will run
PORT = 3000

# URL of the MongoDB database
MONGODB_URI = "mongodb://localhost:27017/prueba-tecnica"
MONGODB_URI_TEST = "mongodb://localhost:27017/prueba-tecnica-test"

# Secret key for generating authentication tokens
SECRET_KEY = "rKLumpH92V3"

# If you do not have a Cloudinary account, you can use the following information
CLOUDINARY_CLOUD_NAME = "dcqoxtpxj"
CLOUDINARY_API_KEY = "636712958952759"
CLOUDINARY_API_SECRET = "nRG9vh_ZDRtTuEuS0HUI6RXs5Lc"
```

## Execution

Commands available:

-   `npm start`: Runs the server in production mode.
-   `npm run dev`: Runs the server in development mode.
-   `npm run test`: Runs the unit tests.
-   `npm run time`: See the development time of the project.
