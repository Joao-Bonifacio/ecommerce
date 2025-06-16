# Ecommerce Project

## Overview
The ecommerce project is a test for a comprehensive online shopping platform designed to provide users with a seamless and intuitive shopping experience. The platform features a wide range of products, user authentication, cart management, and more.

## Key Features
1. User Registration and Authentication
2. Product Catalog with Filtering Search
3. Seller Pannel
4. Profile Settings Page
5. Shopping Cart Management
6. __More Features Comming Soon...__

## Technologies Used
1. Frontend: Next.js, React, TypeScript
2. Backend: NestJS, Node.js, TypeScript
3. DBs: PostgreSQL, Mongo, Redis Minio(S3) + PrismaORM
4. Auth: JWT (JSON Web Tokens)
5. Validation: Zod
6. QA: Vitest, Cypress, Sonarqube, EsLint + Prettier
7. CI: GitHub Actions
8. Infra: Docker, Kubernetes, Kong and Kiali
9. OTEL: Grafana, Prometheus, OpenTelemetry and Jeager
10. __More  Technologies Implementation Comming Soon...__

## Project Structure
The project follows a microservices architecture with separate services for frontend, backend, database and more.

## Getting Started (dev)
1. Clone the repository 
```
git clone https://github.com/Joao-Bonifacio/ecommerce.git; cd ecommerce
```

2. Setup Databases (in docker folder)
```
docker compose up -d #If you use local db on docker (in dev), edit compose.yaml
```

2. Setup Backend (in backend folder)
```
npm i
```

```
npm run db:seed
```

```
npm run dev
```

2. Setup Frontend (in frontend folder)
```
npm i
```

```
npm run dev
```

## Contributing
Contributions are welcome. Please submit a pull request with your changes.

## License
This project is licensed under the MIT License.