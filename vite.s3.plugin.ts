import {
    DeleteObjectCommand,
    ListObjectsCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import fs from 'fs';
import mimeTypes from 'mime-types';
import path from 'path';
import readDir from 'recursive-readdir';
import { ConfigEnv, Plugin, ResolvedConfig, UserConfig } from 'vite';

const PATH_SEP = path.sep;
const UPLOAD_IGNORES: string[] = ['.DS_Store', 'index.html'];

const translatePathFromFiles = (dir: string, files: string[]) => {
    return files.map((file: string) => ({
        path: file,
        name: file.replace(dir, '').split(PATH_SEP).join('/'),
    }));
};

const getDirectoryFilesRecursive = async (
    dir: string,
    ignores: ReadonlyArray<string> = []
): Promise<{ path: string; name: string }[]> => {
    return new Promise((resolve, reject) => {
        readDir(dir, ignores, (error: Error, files: string[]) => {
            if (error) {
                reject(error);
            } else {
                resolve(translatePathFromFiles(dir, files));
            }
        });
    });
};

const clearReactFilesInRoot = async (s3Client: S3Client, bucket: string) => {
    const listObjectsCommand = new ListObjectsCommand({
        Bucket: bucket,
    });

    const { Contents } = await s3Client.send(listObjectsCommand);
    if (!Contents || Contents.length === 0) {
        return;
    }

    const objectsToDelete = Contents.filter(({ Key }) => {
        if (!Key) return false;
        if (Key.startsWith('guide/')) return false;
        if (Key.startsWith('assets/')) return true;
        return false;
    });

    if (objectsToDelete.length > 0) {
        await Promise.all(
            objectsToDelete.map(({ Key }) => {
                if (!Key) return;
                const command = new DeleteObjectCommand({ Bucket: bucket, Key });
                return s3Client.send(command);
            })
        );
    }
};

export default function s3Upload(options: {
    enabled: boolean;
    bucket: string;
    region: string;
    endpoint: string;
    accessKey: string;
    secretKey: string;
}): Plugin {
    let vite: ResolvedConfig;

    return {
        name: 'vite-plugin-s3',
        enforce: 'post',
        apply(_: UserConfig, { command }: ConfigEnv) {
            return command === 'build' && options.enabled;
        },
        configResolved(config: ResolvedConfig) {
            vite = config;
        },
        closeBundle: {
            async handler() {
                if (!vite.build.ssr && options.enabled) {
                    const allFiles = await getDirectoryFilesRecursive('dist', UPLOAD_IGNORES);

                    const s3Client = new S3Client({
                        credentials: {
                            accessKeyId: options.accessKey,
                            secretAccessKey: options.secretKey,
                        },
                        region: options.region,
                        endpoint: options.endpoint,
                        forcePathStyle: true,
                    });

                    await clearReactFilesInRoot(s3Client, options.bucket);
                    for (const file of allFiles) {
                        const fileContent = fs.readFileSync(file.path);
                        const contentType = mimeTypes.lookup(file.name) || 'application/octet-stream';
                        const contentDisposition = `inline; filename="${path.basename(file.name)}"`;
                        const key = file.name.startsWith('/') ? file.name.slice(1) : file.name;
                        const command = new PutObjectCommand({
                            Bucket: options.bucket,
                            Key: key,
                            Body: fileContent,
                            ContentType: contentType,
                            ContentDisposition: contentDisposition,
                            CacheControl: 'public, max-age=31536000, immutable'
                        });

                        await s3Client.send(command);
                        console.log('\x1b[90m%s\x1b[0m', `${file.name} uploaded`);
                    }

                    console.log(
                        '\x1b[32m%s\x1b[0m',
                        `✓ dist folder был загружен в корень бакета "${options.bucket}"`
                    );
                }
            },
        },
    };
}