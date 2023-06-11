const NodeCache = require('node-cache');
const { EC2Client, DescribeInstancesCommand } = require("@aws-sdk/client-ec2");

const cache = new NodeCache();


const regionsFree = [
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
    'sa-east-1'
  ];
//retrieve MaxResults Data
async function getAllActiveEC2Instances(accessKeyId, secretAccessKey, freeUser, startFrom, email, region) {
    const instances = [];
    let lastItemPosition = startFrom[region]?.NextToken || '';
  
    const ec2Client = new EC2Client({
      region: region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });
  
    let regionInstances = [];
  
    do {
      const params = {
        Filters: [{ Name: 'instance-state-name', Values: ['running'] }],
        MaxResults: 1000,
        NextToken: lastItemPosition,
      };
  
      const command = new DescribeInstancesCommand(params);
      const response = await ec2Client.send(command);
  
      if (!response.Reservations.length) {
        break;
      }
  
      regionInstances = response.Reservations.flatMap((r) =>
        r.Instances.map((instance) => ({
          name: instance.Tags.find((tag) => tag.Key === 'Name')?.Value || '',
          id: instance.InstanceId,
          type: instance.InstanceType,
          state: instance.State.Name,
          az: instance.Placement.AvailabilityZone,
          publicIP: instance.PublicIpAddress || '',
          privateIPs: instance.PrivateIpAddress || [],
        }))
      );
  
      instances.push(...regionInstances);
  
      lastItemPosition = response.NextToken;
    } while (lastItemPosition);
  
    const cacheKey = `ec2-instances-${email}-${region}`;
    const cachedData = cache.get(cacheKey);
  
    if (cachedData) {
      cachedData.lastItemPosition = lastItemPosition ? { [region]: { NextToken: lastItemPosition } } : '';
      cachedData.instances = cachedData.instances.concat(instances);
      cache.set(cacheKey, cachedData);
    } else {
      cache.set(cacheKey, { instances, lastItemPosition: lastItemPosition ? { [region]: { NextToken: lastItemPosition } } : '' });
    }
  
    return { instances, lastItemPosition };
  }
  
  //general bring EC2Instances + check
  async function getEC2InstancesByCacheKey(sortKey, dropdownKey, email, region,userData) {
    await retrieveData(userData.accessKeyId, userData.secretAccessKey, userData.freeUser, email, region,userData);
    const cacheKey = `ec2-instances-${email}-${region}`;
    const cacheData = cache.get(cacheKey);
    if (!cacheData) {
      return [];
    }
  
    let sortedData = cacheData.instances;
    if (dropdownKey === "ascending") {
      sortedData.sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1));
    } else if (dropdownKey === "descending") {
      sortedData.sort((a, b) => (a[sortKey] > b[sortKey] ? -1 : 1));
    }
  
    return sortedData;
  }
  
  //need to bring  new retrieve Data
  async function retrieveData(accessKeyId, secretAccessKey, freeUser, email, region,) {
    let startFrom = {};
    const cacheKey = `ec2-instances-${email}-${region}`;
    const cachedData = cache.get(cacheKey);
  
    if (freeUser && !regionsFree.includes(region)) {
      if (cachedData) {
        return cachedData;
      } else {
        return [];
      }
    }
  
    if (cachedData && cachedData.lastItemPosition === '') {
      return cachedData;
    }
  
    if (cachedData) {
      startFrom = cachedData.lastItemPosition;
    }
  
    return getAllActiveEC2Instances(accessKeyId, secretAccessKey, freeUser, startFrom, email, region);
  }


  module.exports = {
    getAllActiveEC2Instances,
    getEC2InstancesByCacheKey,
    retrieveData
  };
  
  
  