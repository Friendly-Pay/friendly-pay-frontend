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

const translatePathFromFiles = (dir: string, files: string[]) =>
    files.map((file: string) => ({
        path: file,
        name: file.replace(dir, '').split(PATH_SEP).join('/'),
    }));

const getDirectoryFilesRecursive = async (
    dir: string,
    ignores: ReadonlyArray<string> = []
): Promise<{ path: string; name: string }[]> =>
    new Promise((resolve, reject) => {
        readDir(dir, ignores, (err, files) => {
            if (err) reject(err);
            else resolve(translatePathFromFiles(dir, files));
        });
    });

const clearDirectory = async (
    s3: S3Client,
    bucket: string,
    prefix = '',
) => {
    const listResp = await s3.send(new ListObjectsCommand({
        Bucket: bucket,
        Prefix: prefix || undefined,
    }));

    const objectsToDelete = listResp.Contents?.filter(({ Key }) => {
        if (!Key) return false;
        if (Key.startsWith('guide/')) return false;
        if (Key.startsWith('guide/')) return false;
        if (Key.startsWith('assets/')) return true;
        return false;
    }) || [];

    if (objectsToDelete.length > 0) {
        await Promise.all(
            objectsToDelete.map(({ Key }) => {
                if (!Key) return;
                const command = new DeleteObjectCommand({ Bucket: bucket, Key });
                return s3.send(command);
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
    let viteConfig: ResolvedConfig;

    return {
        name: 'vite-plugin-s3',
        enforce: 'post',
        apply(_: UserConfig, { command }: ConfigEnv) {
            return command === 'build' && options.enabled;
        },
        configResolved(config) {
            viteConfig = config;
        },
        closeBundle: {
            async handler() {
                if (viteConfig.build.ssr || !options.enabled) return;

                const files = await getDirectoryFilesRecursive('dist', UPLOAD_IGNORES);
                const subDir = process.env.VITE_S3_SUBDIRECTORY
                    ?.replace(/^\/|\/$/g, '') || '';
                const prefix = subDir ? `${subDir}/` : '';

                const s3 = new S3Client({
                    credentials: {
                        accessKeyId: options.accessKey,
                        secretAccessKey: options.secretKey,
                    },
                    region: options.region,
                    endpoint: options.endpoint,
                    forcePathStyle: true,
                });

                await clearDirectory(s3, options.bucket, prefix);

                for (const file of files) {
                    const body = fs.readFileSync(file.path);
                    const contentType = mimeTypes.lookup(file.name) || 'application/octet-stream';
                    const disposition = `inline; filename="${path.basename(file.name)}"`;
                    const key = `${prefix}${file.name.replace(/^\//, '')}`;

                    await s3.send(new PutObjectCommand({
                        Bucket: options.bucket,
                        Key: key,
                        Body: body,
                        ContentType: contentType,
                        ContentDisposition: disposition,
                        CacheControl: 'public, max-age=31536000, immutable',
                    }));

                    console.log('\x1b[90m%s\x1b[0m', `${key} uploaded`);
                }

                console.log(
                    '\x1b[32m%s\x1b[0m',
                    `✓ dist uploaded to ${prefix || 'root'} of bucket "${options.bucket}"`
                );
            },
        },
    };
}