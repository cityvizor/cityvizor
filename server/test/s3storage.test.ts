const mockClient = {
  fGetObject: jest.fn(),
  fPutObject: jest.fn(),
};

jest.mock("minio", () => ({
  Client: jest.fn(() => mockClient),
}));

jest.mock("../src/config", () => ({
  __esModule: true,
  default: {
    s3: {
      endPoint: "minio.cityvizor",
      endPointCDN: "https://cdn.cityvizor.test",
      port: 9000,
      useSSL: true,
      accessKey: "access-key",
      secretKey: "secret-key",
      public_bucket: "public-bucket",
      private_bucket: "private-bucket",
    },
  },
}));

jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  existsSync: jest.fn(),
}));

import { Client } from "minio";
import * as fs from "fs";
import {
  getS3AvatarPublicObjectPath,
  getS3Client,
  getS3PublicUrl,
  S3downloadPrivateFile,
  S3downloadPublicFile,
  S3uploadFile,
  S3uploadPrivateFile,
  S3uploadPublicFile,
} from "../src/s3storage";

const MockedClient = Client as jest.Mock;
const mockedExistsSync = fs.existsSync as jest.Mock;

describe("s3storage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockClient.fGetObject.mockResolvedValue(undefined);
    mockClient.fPutObject.mockResolvedValue({ etag: "test-etag" });
  });

  describe("getS3Client", () => {
    it("creates a MinIO client from S3 config", () => {
      const client = getS3Client();

      expect(client).toBe(mockClient);
      expect(MockedClient).toHaveBeenCalledWith({
        endPoint: "minio.cityvizor",
        port: 9000,
        useSSL: true,
        accessKey: "access-key",
        secretKey: "secret-key",
      });
    });
  });

  describe("public object paths", () => {
    it("builds a public S3 URL", () => {
      expect(getS3PublicUrl("avatars/avatar_10.png")).toBe(
        "https://cdn.cityvizor.test/public-bucket/avatars/avatar_10.png"
      );
    });

    it("builds avatar object paths and URLs", () => {
      expect(getS3AvatarPublicObjectPath(10, ".png")).toBe(
        "avatars/avatar_10.png"
      );
      expect(getS3AvatarPublicObjectPath(10, ".png", true)).toBe(
        "https://cdn.cityvizor.test/public-bucket/avatars/avatar_10.png"
      );
    });
  });

  describe("uploads", () => {
    it("throws before calling MinIO when the local file does not exist", async () => {
      mockedExistsSync.mockReturnValue(false);

      await expect(
        S3uploadFile("bucket", "object.txt", "/missing/object.txt")
      ).rejects.toThrow("local path does not exist: /missing/object.txt");
      expect(MockedClient).not.toHaveBeenCalled();
      expect(mockClient.fPutObject).not.toHaveBeenCalled();
    });

    it("uploads files to an explicit bucket", async () => {
      mockedExistsSync.mockReturnValue(true);
      const metadata = { contentType: "text/plain" };

      await expect(
        S3uploadFile("bucket", "object.txt", "/tmp/object.txt", metadata)
      ).resolves.toEqual({ etag: "test-etag" });

      expect(mockClient.fPutObject).toHaveBeenCalledWith(
        "bucket",
        "object.txt",
        "/tmp/object.txt",
        metadata
      );
    });

    it("uploads public and private files to configured buckets", async () => {
      mockedExistsSync.mockReturnValue(true);

      await S3uploadPublicFile("public.txt", "/tmp/public.txt");
      await S3uploadPrivateFile("private.txt", "/tmp/private.txt", {
        cache: "no-store",
      });

      expect(mockClient.fPutObject).toHaveBeenNthCalledWith(
        1,
        "public-bucket",
        "public.txt",
        "/tmp/public.txt",
        {}
      );
      expect(mockClient.fPutObject).toHaveBeenNthCalledWith(
        2,
        "private-bucket",
        "private.txt",
        "/tmp/private.txt",
        { cache: "no-store" }
      );
    });
  });

  describe("downloads", () => {
    it("downloads public and private files from configured buckets", async () => {
      await S3downloadPublicFile("public.txt", "/tmp/public.txt");
      await S3downloadPrivateFile("private.txt", "/tmp/private.txt");

      expect(mockClient.fGetObject).toHaveBeenNthCalledWith(
        1,
        "public-bucket",
        "public.txt",
        "/tmp/public.txt"
      );
      expect(mockClient.fGetObject).toHaveBeenNthCalledWith(
        2,
        "private-bucket",
        "private.txt",
        "/tmp/private.txt"
      );
    });
  });
});
