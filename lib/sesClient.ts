import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
const sesClient = new SESClient({
  region: process.env.REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    sessionToken: process.env.AWS_SESSION_TOKEN,
  },
});

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
  console.log(source);
  try {
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
