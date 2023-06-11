const express = require("express");
const cors = require("cors");
const service = require("../service/Service")
const app = express();
const port = 3001;
const pageSize = 100;

// Middleware to parse JSON body
app.use(express.json());

// Enable CORS for all routes
app.use(cors());


// Route for user registration
app.post("/register", async (req, res) => {
  const { email, password, name, accessKeyId, secretAccessKey, freeUser } = req.body;
  try{
  await service.register(email, password, name, accessKeyId, secretAccessKey, freeUser);
  res.status(200).json({ message: "User registered successfully" });
}
  catch (error) {
    res.status(401).json({ message:error.message});
  }
});

// Route for user login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if the email and password match the registered user
  try{
    await service.login(email, password);
    res.status(200).json({ message: "Login successful" });
  }
  catch(error){
    res.status(401).json({message:error.message});
  }
});
   
// Route for sorting and pagination
app.post("/sortData", async (req, res) => {
  const { sortKey, dropdownKey, email,region } = req.body;
  const sortedData = await service.getEC2InstancesByCacheKey(sortKey, dropdownKey, email,region);
  res.status(200).json(sortedData);
});

// Route for logout
app.post("/logout", async (req, res) => {
  const { email } = req.body;
   await service.logout(email);
  res.status(200).json({message: "Lgout successful"});
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
