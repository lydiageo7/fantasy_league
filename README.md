Step-by-step instructions for setting up and running the Fantasyland League Web Application on a local development environment:
1.	Prerequisites
a.	Ensure you have Node.js (v16+) and npm installed on your machine. You can download them from: https://nodejs.org/
b.	This project uses SQLite as the database engine.Download it from: https://www.sqlite.org/download.html .Alternatively, use a GUI tool like DB Browser for SQLite for easy database management.
2.	Clone the project
Open your terminal and run the following command to clone the repository: git clone [REPOSITORY_URL]. Replace [REPOSITORY_URL] with the actual URL GitHub repository.
3.	Navigate to the Project Directory:
Write the command: cd [project-folder-name] 
4.	Install Dependencies:
Install the required Node.js packages using npm: npm install
This will install dependencies defined in the package.json file, including:
express (for the web server),express-session (for admin authentication),argon2 (for password hashing),sqlite3 (for database operations),dotenv (for environment variable management).
5.	Configure Environment Variables:
If you want to use environment variables, create a .env file in the root directory: PORT=3000
SESSION_SECRET=your_secret_key
6.	Set Up the Database
7.	Run the Application :
In the terminal, run : node app.js or use nodemon for hot reloading (if installed globally): nodemon app.js. The server will start on: http://localhost:3000
