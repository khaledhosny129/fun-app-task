# Fun App

## Features
- **User Registration and Authentication**: Robust mechanisms for user sign-up, login, and JWT-based secure authentication.
- **Interactive APIs**: Engaging endpoints that enhance user interaction and enable fun functionalities.
- **Error Handling**: Detailed and clear responses for invalid requests, unauthorized access, and other common issues.
- **Role-Based Access Control**: Protected routes and features accessible only by authorized roles.
- **Data Validation**: Input validation using industry-standard practices to ensure data integrity.

## API Documentation
For detailed information on how to use the APIs, refer to the following documentation:

- [Postman API Documentation](https://documenter.getpostman.com/view/28638193/2sAY55ZdAQ): This comprehensive Postman collection provides examples, descriptions, and testing capabilities for all available API endpoints in the Fun App.
- [SwaggerHub API Documentation](http://localhost:3000/api): This Swagger-based documentation offers an interactive, structured view of the Fun App's API, including detailed endpoint specifications, input parameters, and response models.

## Core Functionalities
### 1. User Management
- **Registration**: New users can register with essential details and credentials.
- **Login**: Existing users can log in securely with email and password.

### 3. Security
- **JWT-Based Authentication**: Ensures that all interactions are secure and that user data is protected.
- **Role Verification**: Routes and resources are restricted based on user roles to provide a safe and controlled environment.

## Getting Started
### Prerequisites
- **Node.js**
- **npm*
- **Database (PostgreSQL)**

### Installation
1. Install the dependencies:
   ```bash
   npm install
   ```

### Configuration
- Ensure to set up environment variables as needed, including `API_KEY_opencagedata` for geographical data services.

### Running the App
To start the app in development mode:
```bash
npm run start:dev
```

### Testing the App
Unit tests can be run using:
```bash
npm run test
```



---
Refer to the [Postman API Documentation](https://documenter.getpostman.com/view/28638193/2sAY55ZdAQ) and [SwaggerHub API Documentation](http://localhost:3000/api) for complete API details and usage.

