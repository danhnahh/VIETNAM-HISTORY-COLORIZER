//
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'
//
// export default defineConfig({
//     plugins: [react()],
//     resolve: {
//         alias: {
//             '@': path.resolve(__dirname, './src'),
//             '@components': path.resolve(__dirname, './src/components'),
//             '@utils': path.resolve(__dirname, './src/utils'),
//             '@hooks': path.resolve(__dirname, './src/hooks'),
//         }
//     },
//     server: {
//         port: 3000,
//         open: true,
//         proxy: {
//             '/process_image': {
//                 target: 'http://localhost:8000', // port backend FastAPI
//                 changeOrigin: true
//             }
//         }
//     },
//     build: {
//         outDir: 'dist',
//         sourcemap: true
//     }
// })
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'
//
// export default defineConfig({
//     plugins: [react()],
//     resolve: {
//         alias: {
//             '@': path.resolve(__dirname, './src'),
//             '@components': path.resolve(__dirname, './src/components'),
//             '@utils': path.resolve(__dirname, './src/utils'),
//             '@hooks': path.resolve(__dirname, './src/hooks'),
//         }
//     },
//     server: {
//         port: 3000, //3000
//         open: true,
//         proxy: {
//             '/process_image': {
//                 target: 'http://210.245.53.88:8000', // Backend Linux
//                 changeOrigin: true
//             },
//             '/process_video': {
//                 target: 'http://210.245.53.88:8000', // Backend Linux
//                 changeOrigin: true
//             }
//         }
//     },
//     build: {
//         outDir: 'dist',
//         sourcemap: true
//     }
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@hooks': path.resolve(__dirname, './src/hooks'),
        }
    },
    server: {
        port: 3000,
        open: true,
        /*proxy: {
            /!*'/process_image': {
                target: 'http://210.245.53.88:8001', // đổi 8000 thành port backend thực tế
                changeOrigin: true
            },
            '/process_video': {
                target: 'http://210.245.53.88:8001', // đổi 8000 thành port backend thực tế
                changeOrigin: true*!/
            }
        }*/
    },
    build: {
        outDir: 'dist',
        sourcemap: true
    }
})
