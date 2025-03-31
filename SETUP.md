# Local Setup Guide for Gujarat College Advisor

This guide provides detailed steps to set up and run the Gujarat College Advisor application on your local machine.

## Step 1: Download and Extract the Project

1. Download the project ZIP file
2. Extract the contents to a folder on your local machine

## Step 2: Install Node.js

If you don't have Node.js installed:
1. Visit [nodejs.org](https://nodejs.org/)
2. Download and install the LTS version (16.x or newer)
3. Verify installation by opening a terminal/command prompt and running:
   ```
   node --version
   npm --version
   ```

## Step 3: Install Project Dependencies

1. Open a terminal/command prompt
2. Navigate to the project folder:
   ```
   cd path/to/gujarat-college-advisor
   ```
3. Install dependencies:
   ```
   npm install
   ```
   (This may take a few minutes as it installs all required packages)

## Step 4: Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. Enable Authentication with Email/Password and Google providers
4. Create a Firestore database with the following collections:
   - `users`
   - `chatMessages`
   - `colleges`
   - `collegeCutoffs`
   - `scholarships`
5. Register a Web App in your Firebase project:
   - Go to Project Settings > Your Apps > Add App > Web
   - Register your app with a name
   - Copy the Firebase configuration (apiKey, authDomain, projectId, etc.)
6. Add 'localhost' to the authorized domains in Authentication settings

## Step 5: Create Environment Variables

1. Create a file named `.env` in the project root directory with the following content:
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   ```
   Replace the values with your actual Firebase configuration

2. If you're using Groq for AI chat functionality:
   - Create an account at [groq.com](https://console.groq.com/)
   - Generate an API key
   - Add it to your `.env` file:
     ```
     GROQ_API_KEY=your_groq_api_key
     ```

## Step 6: Run the Application

1. Start the development server:
   ```
   npm run dev
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Step 7: Populate Test Data (Optional)

1. Create an admin user by registering with one of these email addresses:
   - admin@example.com
   - parinp157@gmail.com
2. Log in with the admin account
3. Navigate to "Colleges by Location" page
4. Click the "Import Gujarat Colleges" button to populate college data

## Common Issues and Troubleshooting

### Firebase Authentication Issues
- Make sure `localhost` is added to authorized domains in Firebase Authentication settings
- Check that your Firebase API key, App ID, and Project ID are correctly set in the `.env` file

### Database Connection Issues
- Verify your Firestore database exists and has proper rules set
- Check for any Firebase console errors

### Application Not Starting
- Ensure all dependencies are installed correctly with `npm install`
- Check if the correct Node.js version is installed (should be 16.x or newer)
- Look for any error messages in the terminal when running `npm run dev`

### API Connection Issues
- Verify you have set up the correct environment variables
- Check that your API keys are valid and have not expired

## Deployment Considerations

When you're ready to deploy the application:

1. Build the project:
   ```
   npm run build
   ```

2. Deploy the contents of the `dist` folder to your hosting provider

3. Update the Firebase Authentication authorized domains to include your deployed domain

4. Set up the environment variables on your hosting platform