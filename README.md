# Password Manager

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (for database)

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/W-Bjwa04/password-management-system.git
   cd password-management-system
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory and add the following variables:

   ```env
   SECRET_KEY=your-secret-key
   ```

   Replace `your-secret-key` with a strong secret key for JWT.

4. **Start MongoDB**

   Make sure MongoDB is running on your local machine or use a cloud MongoDB service.

5. **Run the Application**

   ```bash
   npm start
   ```

   The application will start and be accessible at [http://localhost:3000](http://localhost:3000).

## Usage

### Access the Application

Open your web browser and go to [http://localhost:3000](http://localhost:3000).

### Register or Login

- Navigate to the registration page to create a new account.
- Login with your credentials to access the dashboard.

### Manage Passwords

- Use the navigation menu to add, view, or delete password categories and descriptions.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. **Fork the Repository**

   Click the "Fork" button on the top right of the repository page.

2. **Create a New Branch**

   ```bash
   git checkout -b feature/your-feature
   ```

3. **Make Changes and Commit**

   ```bash
   git add .
   git commit -m "Add your message here"
   ```

4. **Push to Your Fork**

   ```bash
   git push origin feature/your-feature
   ```

5. **Create a Pull Request**

   Open a pull request from your forked repository to the main repository.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

**Created by W-Bjwa04**

## Acknowledgements

- [Bootstrap](https://getbootstrap.com/) for styling
- [MongoDB](https://www.mongodb.com/) for database management
- [Express.js](https://expressjs.com/) for server-side logic
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) for password hashing
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) for JWT authentication
- [Connect-Flash](https://www.npmjs.com/package/connect-flash) for flash messages
