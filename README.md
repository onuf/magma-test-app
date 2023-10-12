# magma-test-app

This Node application consists of two services (`User Service` and `Notification Service`) and uses Express and TypeScript. The services are containerized with Docker and included into the Docker Compose [configuration of the project](docker-compose.yml).

To launch the application, execute the following command in the project root directory:

```sh
docker-compose up
```

Overview:

- [User Service](src/services/user-service)
  - CRUD operations are implemented for a user entity that includes fields: `id`, `name`, `email`, and `createdAt`. Use [requests](src/services/user-service/requests) to test the implementation (requires installation of the `REST Client` plugin in VS Code).
  - MongoDB is used as a datastore for the user entity.
  - The input data is validated using `mongoose-unique-validator` and utilities of the project.
  - Pagination is implemented for the GET method that retrieves users (by default, the first 5 items are displayed). The method also returns metadata (the total number of documents and pages, current page number and item count for the current page).
  - Error handling is implemented using the `express-async-errors` package and request error handler middleware.
  - Publishes user events (creation, deletion).

- [Notification Service](src/services/notification-service)
  - Consumes messages from message broker `RabbitMQ` (using direct exchange type).
  - Whenever a user is created, sends a mock notification welcoming the user.
  - Whenever a user is deleted, sends a mock notification informing about the deletion.
