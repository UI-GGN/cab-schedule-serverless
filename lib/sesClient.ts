import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { getIAMCreds } from "./stsClient";

export const sendEmailNotification = async (
  {
    employeeName,
    pickupLocation,
    dropLocation,
    pickupTime,
    phoneNumber,
  }: {
    employeeName: string;
    phoneNumber: string;
    pickupLocation: string;
    dropLocation: string;
    pickupTime: string;
  },
  adminAddresses: string,
  source: { SourceArn: any; Source: any }
) => {
  try {
 const creds = await getIAMCreds();
    const sesClient = new SESClient({
      region: process.env.REGION,
    
      credentials: {
        secretAccessKey: creds?.SecretAccessKey || "",
        accessKeyId: creds?.AccessKeyId || "",
        sessionToken: creds?.SessionToken || ""
      },
    }); 
    
    const d = await sesClient.send(
      new SendEmailCommand({
        Destination: { ToAddresses: [adminAddresses] },
        Message: {
          Subject: {
            Data: "Message from Cab Request",
          },
          Body: {
            Html: {
              Data: `<p> Hi, <b> ${employeeName}</b> needs a cab.<br/> 
              <span >Pickup Location: </span><b> ${pickupLocation}</b><br/> 
              <span >Drop Location: </span><b> ${dropLocation}</b> <br/> 
              <span >Pickup Date: </span> <b> ${new Date(
                pickupTime
              ).toDateString()} </b><br/> 
               <span >Pickup Time: </span> <b> ${new Date(
                 pickupTime
               ).toLocaleTimeString()} </b><br/> 
              <span > Employee contact info: </span> <b><a href=tel:${phoneNumber}> ${phoneNumber}</a></b></p>`,
              Charset: "UTF-8",
            },
          },
        },
        Source: source.Source,
        ReplyToAddresses: [source.Source],
      })
    );
    console.log(d);
  } catch (error) {
    console.log("error", error);
  }
};
