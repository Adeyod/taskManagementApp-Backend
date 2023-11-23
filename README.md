# TaskManagment App

TaskManagement app is a simple task management application which allows Authenticated user to create, read, update and delete task.

## Features

- User registration and user login
- Logout functionality included
- Authenticated users are allowed to Create, update, read, and delete tasks
- Email verification is added
- Email notification is also added to notify users 15mins to the start of each task

## Installation

- Clone the repository
- Install dependencies with 'npm install'
- Configure your database
- For the email verification, the link needs to be changed if it is going to be connected to the frontend for proper routing to the frontend.

## Usage

- Run the app with 'npm start'
- Open your browser and go to 'http://localhost:3333'
- Copy this URL, create a dotenv file and save the URL as BACKEND_URL
- You will also need to create the following variables inside your .env file for nodemailer to work. Nodemailer is the package used for sending mails to register users and as such the code will not function well if it is not running. They are:

1. HOST
2. SERVICE
3. EMAIL_PORT
4. SECURE
5. USER
6. PASS

## Acknowledgments

This project was built with Nodejs, Express, Mongodb and many other NPM packages.

## Note

I will be adding the frontend codes using React very soon and by that time i will be hosting it on render for public use.

## Contact

For questions or feedback, contact me on ayodejiadebolu@gmail.com
