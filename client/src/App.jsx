import { Container } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom.js";
import UpdateProfilePage from "./pages/UpdateProfilePage.jsx";
import CreatePost from "./components/CreatePost.jsx";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const user = useRecoilValue(userAtom);
  console.log(user);

  return (
    <ErrorBoundary>
      <Container maxW="620px">
        <Header />

        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <>
                  <HomePage />
                  <CreatePost />
                </>
              ) : (
                <Navigate to="/auth" />
              )
            }
          />

          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to="/" />}
          />

          <Route
            path="/update"
            element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
          />

          <Route
            path="/:username"
            element={
              <>
                <UserPage />
                {user && <CreatePost />}
              </>
            }
          />

          <Route path="/:username/post/:pid" element={<PostPage />} />
        </Routes>
      </Container>
    </ErrorBoundary>
  );
}

export default App;
