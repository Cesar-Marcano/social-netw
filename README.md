# Social Network Backend API

[![MIT License](https://img.shields.io/badge/License-MIT-green)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v20-brightgreen)](https://nodejs.org)
[![Node.js](https://img.shields.io/badge/pnpm-latest-brightgreen)](https://pnpm.io)

## Table of Contents

- [Social Network Backend API](#social-network-backend-api)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Steps (pnpm)](#steps-pnpm)
    - [Steps (docker-compose)](#steps-docker-compose)
  - [Usage](#usage)
  - [License](#license)
  - [Contributing](#contributing)
    - [Steps to contribute](#steps-to-contribute)

---

## Introduction

This is the backend API for a social network platform. It provides endpoints for managing user accounts, posts, comments, and other social network functionalities. The API is built using **NestJS** and **GraphQL**.

The project is designed with a focus on scalability, security, and ease of use, making it an ideal foundation for building social media platforms.

---

## Features

- User authentication and authorization with access and refresh tokens
- Post creation, updating, deletion and search by terms.
- Commenting on posts
- Follow and unfollow users
- JWT token-based authentication
- Secure password handling (bcrypt)
- Easy-to-use GraphQL API

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v20.x
- [pnpm](https://pnpm.io/) latest

Or

- [Docker](https://docker.com) v27.3.x
- [docker-compose](https://docker.com) v2.30.x

### Steps (pnpm)

1. Clone the repository:

   ```bash
   git clone https://github.com/Cesar-Marcano/social-netw.git
   cd social-netw
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Configure environment variables (e.g., `.env`):

   You will need to set up the following environment variables:
   - `MONGO_URI`: The connection URL for your MongoDB database.
   - `JWT_SECRET`: Secret key used for generating JWT tokens.
   - `BCRYPT_ROUNDS`: Bcrypt salt rounds for password hashing.
   - `JWT_ACCESS_TOKEN_EXPIRATION`
   - `JWT_REFRESH_TOKEN_EXPIRATION`

4. Run the application:

   ```bash
   pnpm start
   ```

   The server should now be running at `http://localhost:3000`.

### Steps (docker-compose)

1. Bring up docker compose:

   ```bash
   docker-compose up
   ```

---

## Usage

Once the server is up and running, you can access the GraphQL API at `http://localhost:3000/graphql`. Here, you can send queries and mutations to interact with the backend.

<!-- For more detailed instructions on how to interact with the API, check the [API Documentation](#api-documentation). -->

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

### Steps to contribute

1. Fork the repository.
2. Create a new branch (`git checkout -b feat/your-feature`).
3. Commit your changes (`git commit -am 'feat: add your feature'`).
4. Push to the branch (`git push origin feat/your-feature`).
5. Open a pull request.
