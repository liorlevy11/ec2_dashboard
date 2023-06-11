
import React, { useState } from "react";

const Register = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [freeUser, setFreeUser] = useState(true);
  const [registrationMessage, setRegistrationMessage] = useState("");

  const validatePassword = (password) => {
    // Regex pattern for password validation (at least 6 characters, including a capital letter and a special sign)
    const pattern = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.{6,})/;
    return pattern.test(password);
  };

  const validateEmail = (email) => {
    // Regex pattern for email validation
    const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return pattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setRegistrationMessage(
        "Invalid password: Password should contain at least 6 characters including a capital letter and a special sign."
      );
      return;
    }

    if (!validateEmail(email)) {
      setRegistrationMessage("Invalid email address.");
      return;
    }


    try {
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          accessKeyId,
          secretAccessKey,
          freeUser,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRegistrationMessage(data.message);
        // Save the registration data and proceed with login
      } else {
        setRegistrationMessage(data.message);
      }
    } catch (error) {
      console.log(error);
      setRegistrationMessage(error.message);
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
      <h2>Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Full name</label>
        <input value={name} name="name" onChange={(e) => setName(e.target.value)} id="name" placeholder="full Name" />
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
        <label htmlFor="accessKeyId">Access Key ID</label>
        <input
          value={accessKeyId}
          onChange={(e) => setAccessKeyId(e.target.value)}
          type="password"
          placeholder="Access Key ID"
          id="accessKeyId"
          name="accessKeyId"
        />
        <label htmlFor="secretAccessKey">Secret Access Key</label>
        <input
          value={secretAccessKey}
          onChange={(e) => setSecretAccessKey(e.target.value)}
          type="password"
          placeholder="Secret Access Key"
          id="secretAccessKey"
          name="secretAccessKey"
        />
        <label htmlFor="free User">AWS Free User</label>
        <input
          type="checkbox"
          checked={freeUser}
          onChange={(e) => setFreeUser(e.target.checked)}
          id="freeUser"
          name="freeUser"
        />
        <button type="submit">Submit</button>
      </form>
      <button className="link-btn" onClick={() => props.onFormSwitch("login")}>
        Already have an account? Login here.
      </button>
      {registrationMessage && <p className="message">{registrationMessage}</p>}
    </div>
    </div>
    </div>
  );
};

export default Register;
