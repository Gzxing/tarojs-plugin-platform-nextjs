import {defineConfig} from 'dumi'

export default defineConfig({
    title: 'taror',
    base: '/tarojs-plugin-platform-nextjs',
    outputPath: 'docs-dist',
    publicPath: '/tarojs-plugin-platform-nextjs/',
    extraBabelPlugins: [
        [
            'import',
            {
                libraryName: '@taror/components',
                libraryDirectory: 'src',
                style: true
            }
        ]
    ],
    themeConfig: {
        hd: {
            rules: [{ mode: 'none' }]
        }
    }
})
