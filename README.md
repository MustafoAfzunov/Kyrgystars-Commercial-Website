KyrgyStars

KyrgyStars is a web application designed to help users explore dining, shopping, and other activities in Kyrgyzstan. It provides a user-friendly interface to browse restaurants, search for various resources, and navigate through different sections like articles, investments, and business solutions. The app is built with React and uses Firebase Firestore for backend data storage.
Features

    Navbar with Search and Social Links: A responsive navbar with links to Home, Articles, Investments, Business Solutions, Directory (with dropdown for Dining, Shopping, Useful, and Kid Activities), Advertising, Stories, and Contact Us. Includes a search bar and social media icons.
    Dining Page: Browse restaurants in Kyrgyzstan with filtering by category and search functionality. Each restaurant card displays its name, description, location, category, and rating.
    Responsive Design: Fully responsive layout that adapts to both desktop and mobile screens.
    Firestore Integration: Fetches data (e.g., restaurants, shops) from Firebase Firestore for dynamic content.
    Search Functionality: Search across multiple collections (restaurants, shops, resources, activities) with real-time results.
    Dynamic Date Display: Shows the current date in the navbar.

Installation

To run this project locally, follow these steps:
Prerequisites

    Node.js (v14 or higher)
    npm or Yarn
    Firebase account (for Firestore setup)

Steps

    Clone the Repository
    bash

git clone https://github.com/your-username/kyrgystars.git
cd kyrgystars
Install Dependencies Using npm:
bash
npm install
Or using Yarn:
bash
yarn install
Set Up Firebase

    Create a Firebase project in the Firebase Console.
    Enable Firestore in your Firebase project.
    Create collections for restaurants, shops, resources, and activities with sample data (e.g., fields like name, description, location, category, rating, image).
    Copy your Firebase configuration (API keys, project ID, etc.) and create a src/firebase.js file with the following structure:
    javascript

    import { initializeApp } from 'firebase/app';
    import { getFirestore } from 'firebase/firestore';

    const firebaseConfig = {
      apiKey: "your-api-key",
      authDomain: "your-auth-domain",
      projectId: "your-project-id",
      storageBucket: "your-storage-bucket",
      messagingSenderId: "your-messaging-sender-id",
      appId: "your-app-id"
    };

    const app = initializeApp(firebaseConfig);
    export const db = getFirestore(app);

Add Assets

    Place the logo image (photo_2025-03-24_19-20-40.jpg) in the src/assets/ directory, or update the path in HomeNavbar.jsx to point to your logo.

Run the Application
bash
npm start
Or with Yarn:
bash

    yarn start
    The app will run on http://localhost:3000.

Usage

    Home Page: Start at the homepage to navigate to different sections using the navbar.
    Dining Page: Go to /directory/dining to browse restaurants. Use the search bar and category filter to find specific restaurants.
    Search: Use the search bar in the navbar to search for restaurants, shops, resources, or activities. Click on a result to navigate to its details page.
    Responsive View: Resize the browser window or use a mobile device to see the mobile-friendly layout, where the navbar stacks vertically.

Technologies Used

    React: Frontend framework for building the UI.
    Firebase Firestore: Backend database for storing and fetching data.
    React Router: For client-side routing.
    CSS: Custom styles for responsive design.
    Font Awesome: For icons (e.g., search, social media).

File Structure
text
kyrgystars/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── assets/
│   │   └── photo_2025-03-24_19-20-40.jpg  # Logo image
│   ├── components/
│   │   ├── HomeNavbar.jsx                 # Navbar component
│   │   └── Navbar.css                    # Navbar styles
│   ├── pages/
│   │   ├── Dining.jsx                    # Dining page component
│   │   └── Dining.css                    # Dining page styles
│   ├── firebase.js                       # Firebase configuration
│   ├── App.js                            # Main app component
│   ├── index.js                          # Entry point
│   └── ...
├── package.json
└── README.md
Contributing

Contributions are welcome! To contribute:

    Fork the repository.
    Create a new branch (git checkout -b feature/your-feature).
    Make your changes and commit (git commit -m "Add your feature").
    Push to your branch (git push origin feature/your-feature).
    Open a Pull Request.

Please ensure your code follows the existing style and includes appropriate tests.
License

This project is licensed under the MIT License. See the  file for details.
Contact

For questions or feedback, please reach out at your-email@example.com.
