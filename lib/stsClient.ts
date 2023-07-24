const { STSClient, AssumeRoleCommand } = require("@aws-sdk/client-sts");


// Create the STS service object    
const client = new STSClient({ region: process.env.REGION});
export const getIAMCreds = async ()=> {

var roleToAssume = {RoleArn: process.env.ROLE_ARN,
RoleSessionName: 'domination-squa',
DurationSeconds: 3600};
const command = new AssumeRoleCommand(roleToAssume);

try {
    const data = await client.send(command);
    return data?.Credentials;
  } catch (error) {
    console.log("=====", error)
  } finally {
  }}
//Assume Role



