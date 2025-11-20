# Job Portal

This is a full-stack job portal application that allows users to search for jobs, apply for them, and connect with other users.

## Live Demo

*   **Client:** [https://job-portal-prod.netlify.app](https://job-portal-prod.netlify.app)
*   **Server:** [https://job-portal-b4hf.onrender.com](https://job-portal-b4hf.onrender.com)

## Features

*   **User Authentication:**
    *   Sign up and log in using email and password.
    *   Sign up and log in with Google OAuth.
    *   Password reset functionality.
*   **Job Posting and Searching:**
    *   Companies can post, update, and delete job listings.
    *   Users can search for jobs using keywords and filters.
*   **Real-time Chat:**
    *   Users can engage in one-on-one real-time conversations.
*   **Networking:**
    *   Send, accept, and reject connection requests to build a professional network.
    *   Follow other users and companies to stay updated.
    *   View a feed of network updates.
*   **User Profiles:**
    *   Create and manage detailed user profiles.
    *   Add and edit education and work experience.
    *   Upload profile pictures and resumes.
*   **Company Profiles:**
    *   Companies can create and manage their own profiles.
*   **Groups:**
    *   Users can create and join groups based on interests or professions.
*   **Events:**
    *   Users can create and manage events.
*   **Advanced Search:**
    *   Comprehensive search functionality to find jobs, people, companies, and groups.
*   **Role-based Access Control:**
    *   The system supports different user roles with varying permissions (e.g., admin).
*   **File Uploads:**
    *   Functionality for uploading and managing files like resumes and profile pictures.

## Technologies Used

### Frontend

*   **Framework:** React
*   **Build Tool:** Vite
*   **State Management:** Redux Toolkit
*   **Styling:** Tailwind CSS, Radix UI
*   **Routing:** React Router
*   **HTTP Client:** Axios
*   **Real-time Communication:** Socket.IO Client
*   **Typing:** TypeScript

### Backend

*   **Framework:** Express.js
*   **Database:** MongoDB (Mongoose)
*   **Authentication:** JWT, bcrypt, Google OAuth
*   **Real-time Communication:** Socket.IO
*   **File Uploads:** Multer, Cloudinary
*   **Validation:** Zod
*   **Linting:** BiomeJS, ESLint
*   **Typing:** TypeScript

## Getting Started

### Prerequisites

*   Node.js
*   npm
*   MongoDB

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/job-portal.git
    ```
2.  Install the dependencies for the client:
    ```bash
    cd client
    npm install
    ```
3.  Install the dependencies for the server:
    ```bash
    cd ../server
    npm install
    ```

### Running the Application

1.  Start the server:
    ```bash
    cd server
    npm run dev
    ```
2.  Start the client:
    ```bash
    cd ../client
    npm run dev
    ```

The application will be available at `http://localhost:5000`.

## Project Structure

The project is divided into two main parts: a `client` directory for the frontend application and a `server` directory for the backend application.

```
job-portal-main/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── layout/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── Routes/
│   │   └── store/
│   ├── package.json
│   └── vite.config.ts
└── server/
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── middlewares/
    │   ├── models/
    │   ├── routes/
    │   ├── socket/
    │   ├── types/
    │   ├── utils/
    │   └── validations/
    ├── package.json
    └── tsconfig.json
```

## API Documentation

The backend API is built with Express.js and provides a set of RESTful endpoints for the frontend to consume. The API is organized around resources like users, jobs, companies, etc.

### Authentication

*   `POST /api/auth/sign-up`: Register a new user.
*   `POST /api/auth/sign-in`: Log in a user.
*   `GET /api/auth/google`: Initiate Google OAuth authentication.

### Jobs

*   `GET /api/jobs`: Get a list of jobs.
*   `POST /api/jobs`: Create a new job posting.
*   `GET /api/jobs/:jobId`: Get a single job by its ID.
*   `PUT /api/jobs/:jobId`: Update a job.
*   `DELETE /api/jobs/:jobId`: Delete a job.

### Profile

*   `GET /api/profile`: Get the profile of the currently logged-in user.
*   `POST /api/profile`: Create or update the user's profile.
*   `GET /api/profile/:userId`: Get the profile of a specific user.

## Configuration

The application uses environment variables for configuration. You will need to create a `.env` file in both the `client` and `server` directories.

### Client `.env`

Create a `.env` file in the `client` directory with the following variables:

```
VITE_API_URL=http://localhost:3000/api
```

### Server `.env`

Create a `.env` file in the `server` directory with the following variables:

```
PORT=3000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
```

## Deployment

To deploy this application, you will need to build both the client and the server and then deploy them to a hosting provider.

### Client

1.  Build the client:
    ```bash
    cd client
    npm run build
    ```
2.  The `dist` directory will contain the static files that you can deploy to a static hosting provider like Netlify, Vercel, or GitHub Pages.

### Server

1.  Build the server:
    ```bash
    cd server
    npm run build
    ```
2.  The `dist` directory will contain the compiled JavaScript files. You can then deploy this directory to a Node.js hosting provider like Heroku, AWS, or a VPS.

## Contributing

Contributions are welcome! If you would like to contribute to this project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch: `git checkout -b my-new-feature`
3.  Make your changes and commit them: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
