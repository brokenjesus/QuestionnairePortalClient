# Questionnaire Portal - Frontend (React)

Frontend application for Questionnaire Portal built with React, Vite, and React Router.

## Features

- **User Authentication** (Login/Registration)
- **Password Recovery** (Forgot/Reset)
- **Questionnaire Management**
- **Response Collection**
- **Profile Management**
- **Protected Routes**
- **Responsive Design**
- **Real-time Updates** (WebSocket)
- **Bootstrap UI Components**

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/questionnaire-portal-frontend.git
   cd questionnaire-portal-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install required packages**
   ```bash
   npm install react-bootstrap bootstrap react-router-dom axios @stomp/stompjs sockjs-client
   # or
   yarn add react-bootstrap bootstrap react-router-dom axios @stomp/stompjs sockjs-client
   ```

4. **Configure environment**
   - Create `.env` file based on `.env.example`
   - Set your backend API URL:
     ```env
      VITE_BASE_URL=http://localhost:8080/api
      VITE_WS_URL=ws://localhost:8080/ws-responses
     ```

5. **Run the application**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react-bootstrap` | ^2.9.0 | Bootstrap components for React |
| `bootstrap` | ^5.3.1 | CSS framework |
| `react-router-dom` | ^6.15.0 | Client-side routing |
| `axios` | ^1.5.0 | HTTP client |
| `@stomp/stompjs` | ^6.1.6 | STOMP over WebSocket |
| `sockjs-client` | ^1.6.1 | WebSocket fallback |
