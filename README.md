# Catalogue de Livres — Projet DevOps

Application de catalogue de livres développée dans le cadre du cours DevOps, respectant les pratiques de l'intégration continue, de l'architecture en couches et de la conteneurisation.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend React                   │
│          (port 3000 — MUI + React Router)           │
└────────────────────┬────────────────────────────────┘
                     │ HTTP
        ┌────────────┴────────────┐
        ▼                         ▼
┌───────────────┐         ┌───────────────┐
│  book-service │         │ author-service│
│   (port 8081) │         │   (port 8082) │
│               │         │               │
│  Controller   │         │  Controller   │
│  Service      │         │  Service      │
│  Repository   │         │  Repository   │
└───────┬───────┘         └───────┬───────┘
        └──────────┬──────────────┘
                   ▼
          ┌────────────────┐
          │   PostgreSQL   │
          │   (port 5432)  │
          └────────────────┘
```

### Couches logicielles

| Couche         | Rôle                                                 |
|----------------|------------------------------------------------------|
| **Data**       | Entités JPA (`Book`, `Author`) + Spring Data JPA    |
| **Service**    | Logique métier CRUD (`BookService`, `AuthorService`) |
| **Controller** | API REST (`/api/books`, `/api/authors`)              |

## Technologies

| Composant        | Technologie                           |
|------------------|---------------------------------------|
| Backend          | Java 17, Spring Boot 2.7, Gradle      |
| Base de données  | PostgreSQL 15 (Docker)                |
| Frontend         | React 18, TypeScript, Material-UI     |
| Tests backend    | JUnit 5, Mockito, MockMvc, JaCoCo    |
| Tests frontend   | Vitest, Testing Library               |
| CI               | GitHub Actions                        |
| Conteneurisation | Docker, Docker Compose                |
| Qualité          | SonarCloud, Codecov                   |

## Lancer l'application

### Prérequis

- Docker et Docker Compose installés
- Java 17 (pour le développement local)
- Node.js 20 (pour le développement frontend local)

### Démarrage complet via Docker

```bash
docker compose up --build
```

Les services seront accessibles à :
- **Frontend** : http://localhost:3000
- **book-service API** : http://localhost:8081/api/books
- **author-service API** : http://localhost:8082/api/authors

### Développement local

#### Backend (book-service)
```bash
cd backend/book-service
./gradlew bootRun
```

#### Backend (author-service)
```bash
cd backend/author-service
./gradlew bootRun
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Tests

### Tests backend

```bash
# book-service
cd backend/book-service
./gradlew test jacocoTestReport

# author-service
cd backend/author-service
./gradlew test jacocoTestReport
```

Les rapports de couverture sont générés dans :
- `backend/book-service/build/reports/jacoco/test/html/index.html`
- `backend/author-service/build/reports/jacoco/test/html/index.html`

### Tests frontend

```bash
cd frontend
npm test                  # exécution simple
npm run test:coverage     # avec rapport de couverture
```

Le rapport de couverture est généré dans `frontend/coverage/`.

## Pipeline CI (GitHub Actions)

Le pipeline se déclenche à chaque push et pull request sur `main` :

1. **Checkout** du code source
2. **Configuration** JDK 17 et Node.js 20
3. **Tests book-service** avec rapport JaCoCo
4. **Tests author-service** avec rapport JaCoCo
5. **Tests frontend** avec couverture Vitest
6. **Upload Codecov** des rapports de couverture
7. **SonarCloud Scan** (si le secret `SONAR_TOKEN` est configuré)
8. **Build Docker** des images

## Structure du projet

```
projet_devops/
├── .github/
│   └── workflows/
│       └── ci.yml
├── backend/
│   ├── book-service/
│   │   ├── src/
│   │   │   ├── main/java/com/example/bookservice/
│   │   │   │   ├── model/Book.java
│   │   │   │   ├── repository/BookRepository.java
│   │   │   │   ├── service/BookService.java
│   │   │   │   └── controller/BookController.java
│   │   │   └── test/java/com/example/bookservice/
│   │   │       ├── service/BookServiceTest.java
│   │   │       └── controller/BookControllerTest.java
│   │   ├── build.gradle
│   │   └── Dockerfile
│   └── author-service/
│       ├── src/
│       │   ├── main/java/com/example/authorservice/
│       │   │   ├── model/Author.java
│       │   │   ├── repository/AuthorRepository.java
│       │   │   ├── service/AuthorService.java
│       │   │   └── controller/AuthorController.java
│       │   └── test/java/com/example/authorservice/
│       │       ├── service/AuthorServiceTest.java
│       │       └── controller/AuthorControllerTest.java
│       ├── build.gradle
│       └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookList.tsx
│   │   │   ├── BookList.test.tsx
│   │   │   ├── AuthorList.tsx
│   │   │   └── AuthorList.test.tsx
│   │   ├── App.tsx
│   │   └── App.test.tsx
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── sonar-project.properties
```

## API REST

### book-service (`http://localhost:8081`)

| Méthode | Endpoint          | Description           |
|---------|-------------------|-----------------------|
| GET     | `/api/books`      | Liste tous les livres |
| GET     | `/api/books/{id}` | Récupère un livre     |
| POST    | `/api/books`      | Crée un livre         |
| PUT     | `/api/books/{id}` | Met à jour un livre   |
| DELETE  | `/api/books/{id}` | Supprime un livre     |

### author-service (`http://localhost:8082`)

| Méthode | Endpoint            | Description             |
|---------|---------------------|-------------------------|
| GET     | `/api/authors`      | Liste tous les auteurs  |
| GET     | `/api/authors/{id}` | Récupère un auteur      |
| POST    | `/api/authors`      | Crée un auteur          |
| PUT     | `/api/authors/{id}` | Met à jour un auteur    |
| DELETE  | `/api/authors/{id}` | Supprime un auteur      |
