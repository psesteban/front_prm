PRM Case Management System
This project is a web application designed to manage cases of psychosocial care. It provides tools for organizing the delivery of reports, viewing relevant information for each case, and generating automatic documentation using predefined templates. The application is built with React and Vite, leveraging modern web technologies for a fast and efficient user experience.

Features
Case Management: View and edit detailed information about each case, including personal details, health, education, and legal information.
Report Organization: Track the status of reports, including pending and overdue submissions.
Automated Documentation: Generate Word documents using predefined templates for various purposes, such as progress reports, intake forms, and circulars.
Task Management: Assign and track tasks for professionals involved in the cases.
Professional Insights: View achievements and tasks for professionals, grouped by their roles.
Authentication: Secure login using Google OAuth.
Responsive Design: Optimized for both desktop and mobile devices.
Project Structure
The project is organized as follows: . ├── public/ │ ├── _redirects # Netlify redirects configuration │ ├── assets/ # Static assets (images, etc.) │ └── templates/ # Word document templates ├── src/ │ ├── assets/ # App-specific assets │ ├── components/ # Reusable React components │ ├── config/ # Configuration files (Firebase, Supabase) │ ├── contexts/ # React Context for global state management │ ├── hooks/ # Custom React hooks │ ├── views/ # Page components for routing │ ├── App.jsx # Main application component │ ├── main.jsx # Entry point for the React app │ └── index.css # Global styles ├── .env # Environment variables (not included in the repo) ├── .gitignore # Files and directories to ignore in Git ├── index.html # Main HTML file ├── package.json # Project dependencies and scripts ├── README.md # Project documentation └── vite.config.js # Vite configuration

Installation
Follow these steps to set up the project locally:

Prerequisites
Node.js (version 16 or higher)
npm or yarn
Steps
Clone the Repository:

git clone https://github.com/your-repo/aft-pf-case-management.git
cd aft-pf-case-management
Install Dependencies: npm install

Set Up Environment Variables: Create a .env file in the root directory and add the following variables:

VITE_SUPABASE_URL=your-supabase-url VITE_SUPABASE_KEY=your-supabase-key VITE_FIREBASE_API_KEY=your-firebase-api-key VITE_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain

Run the Development Server:
npm run dev

Build for Production: To create a production build, run:

npm run build

Preview the Production Build: npm run preview

Usage Login: Use your Google account to log in. Dashboard: View pending and overdue reports, tasks, and achievements. Case Management: Navigate to the "Cases" section to view and edit case details. Generate Documents: Use the "Formats" feature to generate Word documents for specific cases. Admin Features: If logged in as an admin, access additional tools for managing professionals and tasks. Technologies Used Frontend: React, React Router, React Bootstrap State Management: React Context API Backend: Supabase (PostgreSQL), Firebase Document Generation: Docxtemplater, PizZip Styling: CSS, Bootstrap Build Tool: Vite Contributing Contributions are welcome! Please fork the repository and submit a pull request with your changes.

License This project is licensed under the MIT License. See the LICENSE file for details.

Contact For questions or suggestions, please contact the developer at: 📧 developer.mind.olivares@gmail.com
