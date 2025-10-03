import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"; 
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
/*
- This function is used to get all games;
- Each game contains price, name, and image.
 */
//Change the below information according to your deployment
const REGION = "us-east-1";
const DYNAMODB_TABLE_NAME = "618993-dynamodb-game";
const S3_BUCKET_NAME = "618993-s3-image-storage";

//DO NOT change the below code as it is working correctly.
const s3 = new S3Client({ region: REGION });
const dynamoDB = new DynamoDBClient({ region: REGION });


export const handler = async (event) => {
  try {
    const { filename, contentType, price, name } = JSON.parse(event.body);
    
    // Generate pre-signed URL
    const uploadParams = {
      Bucket: S3_BUCKET_NAME,
      Key: filename,
      ContentType: contentType,
    };
    const command = new PutObjectCommand(uploadParams);
    
    const uploadURL = await getSignedUrl(s3, command, { expiresIn: 60 });
    // Save data to DynamoDB
    const item = {
      price: { S: price },
      name: {S: name},
      image: { S: filename }
    };

    await dynamoDB.send(new PutItemCommand({
      TableName: DYNAMODB_TABLE_NAME,
      Item: item,
    }));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ uploadURL }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};