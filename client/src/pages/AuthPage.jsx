import { useRecoilValue } from "recoil";
import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignupCard";
import authScreenAtom from "../atoms/authAtom";
import { useLocation } from "react-router-dom";

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  const location = useLocation();
  const fromTrivia = location.state?.fromTrivia;

  return (
    <>
      {fromTrivia && <h2>Congratulations on completing the trivia!</h2>}
      {authScreenState === "login" ? <LoginCard /> : <SignupCard />}
    </>
  );
};

export default AuthPage;
