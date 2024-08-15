import React from "react";
import { Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom.js";
import { triviaCompletedAtom } from "./atoms/triviaAtom.js";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import CreatePost from "./components/CreatePost";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import WelcomePage from "./pages/WelcomePage";
import TriviaPage from "./pages/TriviaPage";

const ProtectedRoute = ({ children }) => {
  const triviaCompleted = useRecoilValue(triviaCompletedAtom);
  const location = useLocation();

  if (!triviaCompleted) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const user = useRecoilValue(userAtom);
  const triviaCompleted = useRecoilValue(triviaCompletedAtom);

  return (
    <Container maxW="620px">
      {triviaCompleted && <Header />}
      <Routes>
        <Route
          path="/"
          element={triviaCompleted ? <Navigate to="/auth" /> : <WelcomePage />}
        />
        <Route path="/trivia" element={<TriviaPage />} />
        <Route
          path="/auth"
          element={
            triviaCompleted ? (
              user ? (
                <Navigate to="/home" />
              ) : (
                <AuthPage />
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              {user ? (
                <>
                  <HomePage />
                  <CreatePost />
                </>
              ) : (
                <Navigate to="/auth" />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/update"
          element={
            <ProtectedRoute>
              {user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/:username"
          element={
            <ProtectedRoute>
              <UserPage />
              {user && <CreatePost />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/:username/post/:pid"
          element={
            <ProtectedRoute>
              <PostPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Container>
  );
}

export default App;
