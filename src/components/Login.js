import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Login successful
        setErrorMessage("");
        // Update the current form to "ec2-dashboard"
        navigate(`/ec2-dashboard?email=${email}`);

        props.onFormSwitch("ec2-dashboard", email);
      } else {
        // Login failed
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("An error occurred while processing the login request"+ error);
    }
  };
  

  return (
    <div className="col-md-12">
    <div className="card card-container">
      <img
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        alt="profile-img"
        className="profile-img-card"
      />
    <div className="auth-form-container">
      
      <h1>Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="youremail@gmail.com"
          id="email"
          name="email"
        />
        <label htmlFor="password">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="********"
          id="password"
          name="password"
        />
        <button type="submit">Log In</button>
      </form>
      <button className="link-btn" onClick={() => props.onFormSwitch("register")}>
        Don't have an account? Register here.
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
    </div>
    </div>
  );
};

export default Login;
