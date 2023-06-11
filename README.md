# Client-Server Project

This project is a client-server application built using Node.js, Express, and React.

# about the project:

As a cloud administrator, I want a custom dashboard showing all of my active EC2 instances,
so that I can give auditors visibility into our cloud infrastructure without having to give them access to the AWS Console. 
Application exposes a RESTful API

## Getting Started

To get started with the project, follow the instructions below.

### Prerequisites

Make sure you have the following software installed on your machine:

- Node.js
- npm (Node Package Manager)


### Installation

1. Clone the repository: git clone https://github.com/liorlevy11/ec2_dashboard.git

2. Navigate to the server directory:cd server

3. Install the server dependencies: npm install

4. Start the server:node server.js

5. Open another terminal and navigate to the client directory:cd src 

6. Install the client dependencies:npm install

7. Start the client UI: npm start 

During the registration process, please make sure to provide valid keys. Invalid keys may result in errors or restricted access.

Now, you should have the server and client running successfully. The server is running on port 3001, and the client UI should open in your browser.

### Usage
After logging in, you will need to select a region from the provided options.

Click on the "Retrieve EC2 Instances for Selected Region" button to load the information into the table. Note that up to 1000 items will be loaded with each click. If you want to fetch more information, you can click the button again.

To switch to another region, select the desired region from the dropdown menu, and click on the "Retrieve EC2 Instances for Selected Region" button again.

You can sort the table by selecting an attribute and sort order, and then pressing the "Sort" button.

By default, the table displays up to 20 EC2 instances. Use the "Next" and "Previous" buttons to navigate through the information and view all the instances.

## Technologies Used

- Node.js
- Express
- React

## Additional Improvements (If I Had More Time)

If I had more time, I would consider making the following improvements to the project:

- Changing the design to be more modern and understandable, especially around the page where the EC2 instance table is displayed.
- Adding additional tests to the registration input, mainly around the keys, to ensure their validity and prevent errors or restricted access.
- Updating the UI and providing a user-friendly message when clicking the "Retrieve EC2 Instances for Selected Region" button if there is no more information to retrieve from AWS.



