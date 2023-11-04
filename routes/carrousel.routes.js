const express = require('express');
const carrouselRouter = express.Router();
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const bucketName = 'images-carrousel-kacperstojczyk2023-prod';

async function getS3ObjectUrls() {
  const client = new S3Client({ region: "us-east-1" })
  const command = new ListObjectsV2Command({ Bucket: bucketName });

  try {
    const result = await client.send(command);
    return result.Contents.map((obj) => `https://${bucketName}.s3.amazonaws.com/${obj.Key}`);
  } catch (err) {
    console.error("Error fetching S3 objects:", err);
    return [];
  }
}

carrouselRouter.get('', async (req, res) => {
    const imageUrls = await getS3ObjectUrls();
    res.json(imageUrls.map(url => ({ url })));
});

module.exports = carrouselRouter;
