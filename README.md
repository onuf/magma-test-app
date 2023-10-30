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

To check the health status of the services, run the command:

```sh
docker-compose ps
```

## Subtask

Add post ms:

- post ms has an API
- create post
- like post
Task:
- How to implement a notification system so that the author of a post can see who liked his post. The notification must indicate the first and last name of the user who liked the post.

## K8S

### General commands

```sh
minikube start
minikube status
kubectl get nodes # all | nodes | pod | services | deployment | replicaset etc.
kubectl apply -f k8-deployment.yaml # apply config
kubectl get deployment dep-name -o yaml > deployment-result.yaml # get the actual config & status from the cluster's etcd
minikube stop
```

See also: <https://gitlab.com/nanuchi/youtube-tutorial-series>

### Local images to K8S (Minikube)

```sh
# Point the cmd terminal to use the docker daemon inside minikube
@FOR /f "tokens=*" %i IN ('minikube -p minikube docker-env --shell cmd') DO @%i
# Build local images
docker build -t user-service-local -f ./src/services/user-service/Dockerfile . 
docker build -t notification-service-local -f ./src/services/notification-service/Dockerfile .
```

Docs: <https://minikube.sigs.k8s.io/docs/handbook/pushing/#1-pushing-directly-to-the-in-cluster-docker-daemon-docker-env>

### Cluster deployment

```sh
minikube start

kubectl apply -f deployments/mongo-secret.yaml     # not used yet
kubectl apply -f deployments/mongo-configmap.yaml  # not used yet
kubectl apply -f deployments/mongo.yaml
kubectl apply -f deployments/rabbitmq.yaml
kubectl apply -f deployments/user-service.yaml
kubectl apply -f deployments/notification-service.yaml

# kubectl port-forward service/user-service 8080:3001   
# GET http://localhost:8080/health

minikube stop
```
