# Attendance Tracking System

The **Attendance Tracking System** is a web application designed to track and manage student attendance. This system allows users to view attendance records, select specific dates, navigate through previous and next dates, and download attendance data in an Excel format.

## Features

- **View Attendance**: View attendance records by selecting specific dates.
- **Manage students**: To add edit and manage their attendance
- **Excel Export**: Download attendance records as an Excel file.
- **Authentication**: Secure login with token-based authentication to ensure only authorized users can access data.
  
## Technologies Used

- **Frontend**: NextJs with Tailwind CSS
- **Backend**: Nextjs NexJS APi Routes
- **Database**: MongoDB
- **Authentication**: Token-based authentication (JWT)
- **Excel Export**: `XLSX` library for Excel file generation

### Prerequisites

Ensure you have the following installed on your system:
- Node.js
- MongoDB (for database setup)
- Yarn or npm

## Installation
- **npm install --legacy-peer-deps** To install graph dependency
- **npm i** To install required packages
- **npm run dev** To start server

### Steps

1. **Clone the Repository**
    ```bash
    git clone https://github.com/sudheerreddy9999/attendance-tracker.git
    cd attendance-tracker
    ```

2. **Install Backend Dependencies**
    ```bash
    cd server
    npm install
    ```

3. **Install Frontend Dependencies**
    ```bash
    cd ../client
    npm install
    ```



4. **Start the Application**

   - To start the backend server, run:
     ```bash
     cd server
     npm start
     ```

   - To start the frontend, open another terminal window and run:
     ```bash
     cd client
     npm start
     ```

5. **Access the Application**

   Once both servers are running, you can access the application in your browser at `http://localhost:3000`.

## Usage

1. **Login**: Authenticate with your credentials to gain access.
2. **View Attendance**: View attendance data for the selected date.
3. **Navigation**: Use the previous and next buttons to move through dates.
4. **Download as Excel**: Click the "Download Attendance as Excel" button to export attendance data for the selected date.


## Login details
1. Teacher : 
   username : sudheerjanga9999@gmail.com
   password : Sudheer@123
  
2 . username : reddyjlokesh1@gmail.com
    password : Hari@7881 
