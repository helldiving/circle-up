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
  // Get the user state from the userAtom
  const user = useRecoilValue(userAtom);
  console.log(user);

  return (
    <ErrorBoundary>
      <Container maxW="620px">
        {/* Render the header component */}
        <Header />

        {/* Define the routes */}
        <Routes>
          {/* Home page route */}
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/auth" />}
          />

          {/* Authentication page route */}
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to="/" />}
          />

          {/* Update profile page route */}
          <Route
            path="/update"
            element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
          />

          {/* User page route - consider removing if CreatePost is already rendering its own button? */}
          <Route
            path="/:username"
            element={
              user ? (
                <>
                  <UserPage />
                  <CreatePost />
                </>
              ) : (
                <UserPage />
              )
            }
          />

          {/* Post page route */}
          <Route path="/:username/post/:pid" element={<PostPage />} />
        </Routes>
      </Container>
    </ErrorBoundary>
  );
}

export default App;
