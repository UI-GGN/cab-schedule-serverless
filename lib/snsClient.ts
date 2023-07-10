import { SNSClient } from "@aws-sdk/client-sns";
import {
  PublishCommand,
  SubscribeCommand,
  ListSubscriptionsByTopicCommand,
} from "@aws-sdk/client-sns";

const snsClient = new SNSClient({
  region: "eu-central-1",

  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    sessionToken: process.env.AWS_SESSION_TOKEN,
  },
});

export const notifyVendor = async (phoneNumber, employeeDetailsForVendor) => {
  try {
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
        } at ${new Date(employeeDetailsForVendor.pickupTime).toTimeString()}. 
        Employee contact info: ${employeeDetailsForVendor.phoneNumber}`,
        PhoneNumber: phoneNumber,
      })
    );
  } catch (err) {
    console.log("Oops", err);
  }
};
