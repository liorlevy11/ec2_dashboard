const NodeCache = require('node-cache');
const { EC2Client, DescribeInstancesCommand,STSClient, GetCallerIdentityCommand } = require("@aws-sdk/client-ec2");

const AWS = require('aws-sdk');
const userCache = new NodeCache();
const loginUserCache = new NodeCache();


//register
async function register(email, password, name, accessKeyId, secretAccessKey, freeUser){
    const cacheKey = `ec2-instances-${email}`;
    if(userCache.get(cacheKey)){
      throw new Error("User with this mail already exists");
    }
    if (!email || !password || !name || !accessKeyId || !secretAccessKey) {
      throw new Error("Missing required attributes");
    }
    if(validateCredentials(accessKeyId, secretAccessKey)==false){
      throw new Error("Invalid credentials:access Key Id, secret AccessKey " );}
  
    const cacheData = {
      accessKeyId,
      secretAccessKey,
      freeUser,
      password,
      name,
      email
    };
    userCache.set(cacheKey, cacheData);
  }

  async function validateCredentials(accessKeyId, secretAccessKey) {
  
    for (const region of regions) {
      try {
        const stsClient = new AWS.STS({
          accessKeyId,
          secretAccessKey,
          region,
        });
  
        await stsClient.getCallerIdentity().promise();
        return true; // Valid credentials in at least one region
      } catch (error) {
        // Credentials are invalid for this region, continue to the next region
      }
    }
    return false;
  }
    
  
  //login
  async function login( email, password ){
    // Check if the email and password match the registered user
   const cacheKey = `ec2-instances-${email}`;
    const user= userCache.get(cacheKey);
    if( user.email!==email )
    throw new Error( "Invalid email" );
   if (user.password !== password) {
    throw new Error( "Invalid password" );}
    const cacheData = {
      password,
      email
    };
    loginUserCache.set(cacheKey, cacheData);
    
   }
  
  
  //logout
   function logout(email) {
    const cacheKey = `ec2-instances-${email}`;
    loginUserCache.del(cacheKey);
   }

function isLogin(email) {
    const cacheKey = `ec2-instances-${email}`;
    return loginUserCache.get(cacheKey);
}
function getUserData(email) {
  const userKey = `ec2-instances-${email}`;
  return userCache.get(userKey);
}   


   const regions = [
    'us-east-1',
    'us-east-2',
    'us-west-1',
    'us-west-2',
    'ap-south-1',
    'ap-southeast-1',
    'ap-southeast-2',
    'ap-northeast-1',
    'ap-northeast-2',
    'ap-northeast-3',
    'ca-central-1',
    'eu-central-1',
    'eu-west-1',
    'eu-west-2',
    'eu-west-3',
    'eu-north-1',
    'sa-east-1',
    'af-south-1',
    'ap-east-1',
    'ap-south-2',
    'ap-southeast-3',
    'ap-southeast-4',
    'eu-south-1',
    'eu-south-2',
    'eu-central-2',
    'me-south-1',
    'me-central-1'
  ];
  module.exports = {
    register,
    login,
    validateCredentials,
    logout,
    isLogin,
    getUserData
  };
  