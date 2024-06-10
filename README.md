# Node.js Role-Based Access Control (RBAC) API

## Description

This repository contains a Role-Based Access Control (RBAC) system implemented in Node.js. The API provides authentication and authorization features, including user and admin management. 

## Features

### Auth API
- **Sign In**: Authenticate users and provide access tokens.
- **Sign Up**: Register new users.
- **Reset Password**: Allow users to reset their passwords.
- **Verify Token**: Verify the authenticity of access tokens.
- **Forgot Password**: Send a password reset link to users' email.

### User API
- **User Details**: Retrieve details of the logged-in user.
- **Update User**: Update information for the logged-in user.

### Admin API
- **Create User**: Admin functionality to create new users.
- **Update User**: Admin functionality to update user information.
- **Find All Users**: Retrieve a list of all users.
- **Find One User**: Retrieve details of a specific user by ID.
- **Delete User**: Delete a user by ID.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/node-rbac-api.git
    ```
2. Navigate to the project directory:
    ```sh
    cd node-rbac-api
    ```
3. Install dependencies:
    ```sh
    npm install
    ```
4. Set up environment variables. Create a `.env` file in the root directory and add the necessary configurations (e.g., database connection, JWT secret).

## Usage

1. Start the server:
    ```sh
    npm start
    ```
2. The API will be available at `http://localhost:3000`.

## API Endpoints

### Auth API
- `POST /auth/signin`: Sign in a user.
- `POST /auth/signup`: Sign up a new user.
- `POST /auth/reset-password`: Reset user password.
- `POST /auth/verify-token`: Verify access token.
- `POST /auth/forgot-password`: Send password reset email.

### User API
- `GET /users`: Get details of the logged-in user.
- `PUT /users`: Update information of the logged-in user.

### Admin API
- `POST /admin/user`: Create a new user.
- `PUT /admin/user/:id`: Update user information by ID.
- `GET /admin/user`: Retrieve all users.
- `GET /admin/user/:id`: Retrieve a specific user by ID.
- `DELETE /admin/user/:id`: Delete a user by ID.

## Email Functionality

The system includes email functionality for sending password reset links and other notifications. Ensure to configure your email service provider details in the `.env` file.

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests for review.

## License

This project is licensed under the MIT License.
