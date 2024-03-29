import { Client, ClientOptions, UploadedObjectInfo } from "minio";
import config from "../config";
import * as fs from "fs";

export function getS3Client(): Client {
  return new Client({
    endPoint: config.s3.endPoint,
    port: config.s3.port,
    useSSL: config.s3.useSSL,
    accessKey: config.s3.accessKey,
    secretKey: config.s3.secretKey,
  } as ClientOptions);
}

export function getS3PublicUrl(objectPath: string): string {
  return `${config.s3.endPointCDN}/${config.s3.public_bucket}/${objectPath}`;
}

export function getS3AvatarPublicObjectPath(
  profileId: number,
  avatarType: string | null,
  returnFullUrl = false
): string {
  const objectPath = `avatars/avatar_${profileId}${avatarType}`;
  return returnFullUrl ? getS3PublicUrl(objectPath) : objectPath;
}

export async function S3uploadFile(
  bucket: string,
  objectPath: string,
  localPath: string,
  metadata: object = {}
): Promise<UploadedObjectInfo> {
  if (!fs.existsSync(localPath)) {
    throw new Error(`local path does not exist: ${localPath}`);
  }

  return getS3Client().fPutObject(bucket, objectPath, localPath, metadata);
}

export async function S3uploadPublicFile(
  objectPath: string,
  localPath: string,
  metadata: object = {}
): Promise<UploadedObjectInfo> {
  return S3uploadFile(config.s3.public_bucket, objectPath, localPath, metadata);
}

export async function S3uploadPrivateFile(
  objectPath: string,
  localPath: string,
  metadata: object = {}
): Promise<UploadedObjectInfo> {
  return S3uploadFile(
    config.s3.private_bucket,
    objectPath,
    localPath,
    metadata
  );
}

export async function S3downloadFile(
  bucket: string,
  objectPath: string,
  localPath: string
): Promise<void> {
  return getS3Client().fGetObject(bucket, objectPath, localPath);
}

export async function S3downloadPublicFile(
  objectPath: string,
  localPath: string
): Promise<void> {
  return S3downloadFile(config.s3.public_bucket, objectPath, localPath);
}

export async function S3downloadPrivateFile(
  objectPath: string,
  localPath: string
): Promise<void> {
  return S3downloadFile(config.s3.private_bucket, objectPath, localPath);
}
