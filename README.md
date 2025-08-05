# SEM2V2 Course Content Application

This is a React application for displaying course content. It allows users to browse courses, view modules, and read educational content.

## Key Features

- Browse available courses
- View course modules and submodules
- Read detailed educational content
- Admin panel for content management
- Mobile-first responsive design

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)

### Installation

1. Clone this repository
2. Navigate to the frontend directory:

```bash
cd frontend
```

3. Install dependencies:

```bash
npm install
```

4. Start the backend server:

```bash
cd ../backend
npm install
npm start
```

5. Start the frontend development server:

```bash
cd ../frontend
npm run dev
```

The application will be available at http://localhost:5173

## Development Notes

- The application connects to the backend API at http://localhost:5000
- Make sure the backend server is running before starting the frontend
- The backend requires MongoDB to be running
- To log into the admin panel, use your backend credentials

## Project Structure

- `/src` - Source code
  - `/assets` - Static assets (images, etc.)
  - `/components` - Reusable UI components
  - `/data` - Mock data for development
  - `/pages` - Page components
  - `/services` - API and authentication services

## Styling

The application uses Tailwind CSS for styling, with a mobile-first approach.te

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
