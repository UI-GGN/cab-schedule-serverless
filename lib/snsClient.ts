import { SNSClient } from "@aws-sdk/client-sns";
import {
  PublishCommand,
  SubscribeCommand,
  ListSubscriptionsByTopicCommand,
} from "@aws-sdk/client-sns";
import { getIAMCreds } from "./stsClient";



export const notifyVendor = async (phoneNumber, employeeDetailsForVendor) => {

  try {
    const creds = await getIAMCreds();
    const snsClient = new SNSClient({
      region: process.env.REGION,
    
      credentials: {
        secretAccessKey: creds?.SecretAccessKey || "",
        accessKeyId: creds?.AccessKeyId || "",
        sessionToken: creds?.SessionToken || ""
      },
    });  
    const { Subscriptions } = await snsClient.send(
      new ListSubscriptionsByTopicCommand({
        TopicArn: process.env.TOPIC_ARN,
      })
    );
    const subscription = Subscriptions?.find(
      (Subscription) => Subscription?.Endpoint === phoneNumber
    );
    if (!subscription) {
      await snsClient.send(
        new SubscribeCommand({
          Protocol: "SMS",
          TopicArn: process.env.TOPIC_ARN,

          Endpoint: phoneNumber,
        })
      );
    }
    await snsClient.send(
      new PublishCommand({
        Message: ` Hi, ${
          employeeDetailsForVendor.employeeName
        } needs a cab from ${employeeDetailsForVendor.pickupLocation} to ${
          employeeDetailsForVendor.dropLocation
        } on ${new Date(
          employeeDetailsForVendor.pickupTime
        ).toDateString()} at ${new Date(employeeDetailsForVendor.pickupTime).toLocaleTimeString()}. 
        
        Employee contact info: ${employeeDetailsForVendor.phoneNumber}`,
        PhoneNumber: phoneNumber,
      })
    );
  } catch (err) {
    console.log("Oops", err);
  }
};
