# Task Management Application

## Overview
This is a RESTful API built using Node.js, Express.js, and MongoDB. The API allows you to manage tasks with features such as filtering, sorting, soft deletion, and authentication.

## Features
- Create, read, update, and delete tasks (CRUD operations).
- Filter tasks by status and priority.
- Sort tasks by creation date or due date.
- Implement pagination for task lists.
- Authentication using a bearer token.
- Soft delete functionality for tasks.
- Logging using Winston.

## Prerequisites
1. Node.js 
2. MongoDB instance 
3. Postman (optional, for testing)

## Setup

### 1. Clone the repository:
```bash
git clone <repository-url>
cd task-management-api
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongo_connection_string
AUTH_TOKEN=uyt76bvc345&^%fgytev12345@%
```

### 4. Start the server:
```bash
npm start
```
The server will run on `http://localhost:5000` by default.

## API Documentation
The Postman documentation for the API is available at:
[Postman Documentation Link](https://documenter.getpostman.com/view/39592422/2sAYBd6Smn)

### Endpoints

#### 1. **POST /tasks**
- Create a new task.
- Requires authentication.

#### 2. **GET /tasks**
- Retrieve a list of tasks.
- Supports filtering, sorting, and pagination.

#### 3. **GET /tasks/:id**
- Retrieve a specific task by ID.
- Requires authentication.

#### 4. **PUT /tasks/:id**
- Update a task by ID.
- Requires authentication.

#### 5. **DELETE /tasks/:id**
- Soft delete a task by ID.
- Requires authentication.

## Testing
You can test the API using Postman or cURL. Use the provided Postman collection in the documentation link for detailed requests and payloads.

### Example cURL Command:
```bash
curl -X POST http://localhost:5000/tasks \
  -H "Authorization: Bearer <your_auth_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sample Task",
    "description": "This is a sample task.",
    "priority": "HIGH"
  }'
```

## Logging
This project uses Winston for logging. Logs are printed to the console and can be extended to support file-based logging.

## Contributing
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push them to your branch.
4. Open a pull request.

## License
This project is licensed under the MIT License.

## Contact
For questions or support, please reach out at [rameshbellani95@gmail.com].

