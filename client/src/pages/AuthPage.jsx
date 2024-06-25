import { useRecoilValue } from "recoil";
import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignupCard";
import authScreenAtom from "../atoms/authAtom";

const AuthPage = () => {
  // Get the current authentication screen state from the authScreenAtom
  const authScreenState = useRecoilValue(authScreenAtom);
  console.log(authScreenState);

  // Render the appropriate authentication card based on the authScreenState
  return <>{authScreenState === "login" ? <LoginCard /> : <SignupCard />}</>;
};

export default AuthPage;
