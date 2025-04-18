import React, { useState } from "react";
import "../styles/Login.scss";
import { setLogin } from "../redux/state";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

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

      if (response.ok && loggedIn) {
        const { user, token } = loggedIn;

        dispatch(
          setLogin({
            user,
            token,
          })
        );

        if (user.role === "host") {
          navigate("/host-dashboard");
        } else if (user.role === "user") {
          navigate("/user-dashboard");
        } else if (user.role === "Admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
          console.log(user.role);
        }
      } else {
        console.log("Login failed: Invalid credentials or server issue.");
      }
    } catch (err) {
      console.log("Login failed", err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  const handleGuestLogin = () => {
    // Use predefined guest credentials
    handleLogin("Guest@guest.com", "guest@123");
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
          <button type="button" onClick={handleGuestLogin} className="guest-login-btn">
            LOGIN AS GUEST
          </button>
        </form>
        <a href="/register">Don't have an account? Sign In Here</a>
      </div>
    </div>
  );
};

export default LoginPage;
