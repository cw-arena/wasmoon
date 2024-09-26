import typescript from '@rollup/plugin-typescript'
import copy from 'rollup-plugin-copy'
import fs from 'fs'

const pkg = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf-8' }))
const production = !process.env.ROLLUP_WATCH

export default {
    input: './src/index.ts',
    output: {
        file: 'dist/index.js',
        format: 'es',
        name: 'wasmoon',
        sourcemap: !production,
    },
    external: ['module'],
    plugins: [
        {
            name: 'package-version',
            resolveId(source) {
                if (source === 'package-version') {
                    return 'package-version'
                }
            },
            load(id) {
                if (id === 'package-version') {
                    return `export default '${pkg.version}'`
                }
            },
        },
        typescript({
            sourceMap: !production,
            outputToFilesystem: true,
        }),
        copy({
            targets: [{ src: 'build/glue.wasm', dest: 'dist' }],
        }),
    ],
}
