import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

export default function Login() {
  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center pt-20">
      <h2 className="text-2xl mb-4">Login</h2>
      <button onClick={login} className="btn btn-primary">
        Login with Google
      </button>
    </div>
  );
}
