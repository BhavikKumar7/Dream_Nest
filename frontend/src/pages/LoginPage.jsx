import React, { useState } from "react";
import "../styles/Login.scss";
import { setLogin } from "../redux/state";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (loginEmail, loginPassword) => {
    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const loggedIn = await response.json();

      if (response.ok && loggedIn.user && loggedIn.token) {
        const { user, token } = loggedIn;

        dispatch(setLogin({ user, token }));

        switch (user.role) {
          case "host":
            navigate("/host-dashboard");
            break;
          case "user":
            navigate("/user-dashboard");
            break;
          case "admin":
            navigate("/admin-dashboard");
            break;
          default:
            navigate("/");
            break;
        }
      } else {
        console.error("Login failed: Invalid credentials or server error.");
        alert("Invalid email or password.");
      }
    } catch (err) {
      console.error("Login failed:", err.message);
      alert("Network or server issue.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  const handleGuestLogin = () => {
    handleLogin("guest@guest.com", "guest@123");
  };

  return (
    <div className="login">
      <div className="login_content">
        <form className="login_content_form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">LOG IN</button>
          <button
            type="button"
            onClick={handleGuestLogin}
            className="guest-login-btn"
          >
            LOGIN AS GUEST
          </button>
        </form>
        <Link to="/register">Don't have an account? Sign Up Here</Link>
      </div>
    </div>
  );
};

export default LoginPage;
