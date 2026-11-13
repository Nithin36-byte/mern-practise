# MongoDB Database Setup

## Database Name
student_management

## Collection
students

## Technology
- MongoDB Atlas
- Mongoose
- Node.js
- Express.js

## Student Schema
- Full Name
- Email
- Mobile
- Gender
- Course
- Address
- Created At
- Updated At

## Database Connection
The reusable database connection is configured in server/config/db.js.

## Environment Variables
The MongoDB connection string is stored in server/.env.
Sensitive credentials must not be uploaded to GitHub.

## Testing
Run node testStudent.js to test the database connection and student creation.