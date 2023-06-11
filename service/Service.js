const NodeCache = require('node-cache');
const { EC2Client, DescribeInstancesCommand,STSClient, GetCallerIdentityCommand } = require("@aws-sdk/client-ec2");

const userController = require("./userControler")
const ec2Controller = require("./ec2Controler")


async function getEC2InstancesByCacheKey(sortKey, dropdownKey, email, region) {
  if( !userController.isLogin(email)){ throw new Error("have to be logged in first");}
  const userData = userController.getUserData(email);
  return ec2Controller.getEC2InstancesByCacheKey(sortKey, dropdownKey,email,region,userData);
}

async function register(email, password, name, accessKeyId, secretAccessKey, freeUser){
  await userController.register(email, password, name, accessKeyId, secretAccessKey,freeUser);
}


async function login( email, password ){
  await userController.login(email, password);
 }



 function logout(email) {
  userController.logout(email);
 }


module.exports = {
  getEC2InstancesByCacheKey,
  register,
  login,
  logout
};
