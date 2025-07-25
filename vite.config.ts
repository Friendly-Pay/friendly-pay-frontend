import s3Upload from './vite.s3.plugin';
import react from '@vitejs/plugin-react-swc';
import autoprefixer from 'autoprefixer';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import tsconfigPaths from 'vite-tsconfig-paths';
// import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    const translationsDir = path.resolve(__dirname, 'src/localization/translates');
    const uploadToS3 = mode === 'production' && process.env.VITE_S3_UPLOAD === 'true';
    const baseUrl = uploadToS3 ? process.env.VITE_CDN_URL : undefined;

    return {
        base: baseUrl,
        plugins: [
            react(),
            tsconfigPaths(),
            createHtmlPlugin({ minify: process.env.VITE_MINIFY_HTML === 'true' }),
            s3Upload({
                enabled: uploadToS3,
                bucket: process.env.VITE_S3_BUCKET!,
                region: process.env.VITE_S3_REGION!,
                endpoint: process.env.VITE_S3_ENDPOINT!,
                accessKey: process.env.VITE_S3_ACCESS_KEY!,
                secretKey: process.env.VITE_S3_SECRET_KEY!,
            })
        ],
        publicDir: './public',
        css: {
            modules: {
                localsConvention: 'camelCaseOnly'
            },
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                    additionalData: `
                    @mixin smallScreen {
                        @media (max-height: 680px) {
                            @content;
                        }
                    }
                    @mixin text-stroke($stroke-color, $stroke-thickness: 3px) {
                        @supports (-webkit-text-stroke: 1px $stroke-color) {
                            -webkit-text-stroke: $stroke-thickness $stroke-color;
                            paint-order: stroke fill;
                        }
                    }
                `}
            },
            postcss: {
                plugins: [autoprefixer()],
            },
        },
        server: {
            port: 5174,
            allowedHosts: true
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.startsWith(translationsDir)) {
                            return 'translations';
                        }
                        if (id.includes('node_modules')) {
                            if (id.includes('react') || id.includes('react-dom')) {
                                return 'react-vendor';
                            }
                            return 'vendor';
                        }
                    },
                }
            }
        }
    };
});
