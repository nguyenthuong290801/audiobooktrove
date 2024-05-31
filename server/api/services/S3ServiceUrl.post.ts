import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig();
    const body = await readBody(event);
    const s3 = new S3Client({
        endpoint: runtimeConfig.endpoint,
        region: runtimeConfig.region,
        credentials: {
            accessKeyId: runtimeConfig.accessKeyId,
            secretAccessKey: runtimeConfig.secretAccessKey
        }
    });

    const listObjectsInFolder = async (bucket, prefix) => {
        const params = {
            Bucket: bucket,
            Prefix: prefix
        };

        const response = await s3.send(new ListObjectsV2Command(params));
        const audioKeys = response.Contents
            .filter(object => /\.(mp3|wav|ogg|flac|aac)$/i.test(object.Key))
            .map(object => object.Key);

        return audioKeys;
    };

    const getPresignedUrlsForObjects = async (bucket, keys) => {
        const presignedUrls = await Promise.all(keys.map(async key => {
            const command = new GetObjectCommand({
                Bucket: bucket,
                Key: key
            });
            const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
            return { key, url: presignedUrl };
        }));
        return presignedUrls;
    };
    
    const objectKeys = await listObjectsInFolder(body.bucket, body.key);
    const presignedUrls = await getPresignedUrlsForObjects(body.bucket, objectKeys);
    return presignedUrls;
});