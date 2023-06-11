import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import EC2DashboardPage from "./components/EC2DashboardPage";
import "./App.css";

function App() {
  const [currentForm, setCurrentForm] = useState("login");
  const [email, setEmail] = useState("");

  const toggleForm = (formName, email) => {
    setCurrentForm(formName);
    setEmail(email);
  };

  const handleLogout = () => {
    // Clear any necessary state or perform other actions on successful logout
    setCurrentForm("login"); // Switch to the login form
    setEmail(""); // Clear the email state
  };

  const renderForm = () => {
    if (currentForm === "login") {
      return <Login onFormSwitch={toggleForm} />;
    } else if (currentForm === "register") {
      return <Register onFormSwitch={toggleForm} />;
    } else if (currentForm === "ec2-dashboard") {
      return <EC2DashboardPage email={email} onLogout={handleLogout} />;
    }
  };

  return <div className="App">{renderForm()}</div>;
}

export default App;

