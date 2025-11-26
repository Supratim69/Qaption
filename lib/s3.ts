import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: process.env.S3_REGION || process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId:
            process.env.S3_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey:
            process.env.S3_SECRET_KEY ||
            process.env.AWS_SECRET_ACCESS_KEY ||
            "",
    },
});

const BUCKET_NAME =
    process.env.S3_BUCKET || process.env.AWS_S3_BUCKET_NAME || "";

export async function uploadToS3(
    file: Buffer,
    fileName: string,
    contentType: string
): Promise<string> {
    const key = `uploads/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: contentType,
        ACL: "public-read", // Make the object publicly readable
    });

    await s3Client.send(command);

    // Return the S3 URL
    const region =
        process.env.S3_REGION || process.env.AWS_REGION || "us-east-1";
    return `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`;
}

export async function getSignedDownloadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });

    // URL expires in 1 hour
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function uploadOutputToS3(
    file: Buffer,
    fileName: string
): Promise<string> {
    const key = `outputs/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: "video/mp4",
        ACL: "public-read", // Make the object publicly readable
    });

    await s3Client.send(command);

    const region =
        process.env.S3_REGION || process.env.AWS_REGION || "us-east-1";
    return `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`;
}
