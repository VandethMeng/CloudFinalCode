import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


/*
- This function is used to get all games;
- Each game will contain price, name, imange, and imageURL
- Frontend will use this information to display.
 */
//Update the below information according to your deployment
const REGION = "us-east-1";
const DYNAMODB_TABLE_NAME = "618993-dynamodb-game";
const S3_BUCKET_NAME = "618993-s3-image-storage";

//DO NOT change the below code as it is working correctly.
const s3 = new S3Client({ region: REGION });
const dynamoDB = new DynamoDBClient({ region: REGION });


export const handler = async () => {
  try {
    const scanCommand = new ScanCommand({ TableName: DYNAMODB_TABLE_NAME });
    const { Items } = await dynamoDB.send(scanCommand);

    const games = Items.map((item) => unmarshall(item));

    const gamesWithImages = await Promise.all(
      games.map(async (game) => {
        if (game.image) {
          const urlCommand = new GetObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: game.image,
          });

          const signedUrl = await getSignedUrl(s3, urlCommand, { expiresIn: 3600 }); // URL valid for 1 hour
          return { ...game, imageUrl: signedUrl };
        }
        return game;
      })
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(gamesWithImages),
    };
  } catch (error) {
    console.error("Error retrieving games:", error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: "Server error", error: error.message }),
    };
  }
};
