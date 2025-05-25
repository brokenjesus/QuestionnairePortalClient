import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogInPage from './pages/LogInPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import IndexPage from './pages/IndexPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import LogOutPage from './pages/LogOutPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import PasswordChangePage from "./pages/PasswordChangePage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import FieldsPage from "./pages/FieldsPage.jsx";
import AllMyQuestionnairesPage from "./pages/AllMyQuestionnairesPage.jsx";
import AllQuestionnairesPage from "./pages/AllQuestionnairesPage.jsx";
import QuestionnairePage from './pages/QuestionnairePage.jsx';

import ResponsesPage from './pages/ResponsesPage.jsx';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LogInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/logout" element={
                    <PrivateRoute>
                        <LogOutPage />
                    </PrivateRoute>
                } />
                <Route path="/profile" element={
                    <PrivateRoute>
                        <ProfilePage />
                    </PrivateRoute>
                } />
                <Route path="/change-password" element={
                    <PrivateRoute>
                        <PasswordChangePage />
                    </PrivateRoute>
                } />
                <Route path="/forgot-password" element={
                    <ForgotPasswordPage />
                } />
                <Route path="/fields" element={
                    <PrivateRoute>
                        <FieldsPage />
                    </PrivateRoute>
                } />
                <Route path="/questionnaires" element={
                    <AllQuestionnairesPage />
                } />
                <Route path="/questionnaires/my" element={
                    <PrivateRoute>
                        <AllMyQuestionnairesPage />
                    </PrivateRoute>
                } />
                <Route path="/responses" element={
                    <PrivateRoute>
                        <ResponsesPage />
                    </PrivateRoute>
                } />
                <Route path="/questionnaires/:id" element={
                    <QuestionnairePage />
                } />
                <Route path="/" element={
                    <IndexPage />
                } />
            </Routes>
        </Router>
    );
}

export default App;
