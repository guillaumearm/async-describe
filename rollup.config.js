import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import async from 'rollup-plugin-async';

const outputs = [
  { format: 'cjs', outputFolder: 'lib' },
  { format: 'es', outputFolder: 'es' },
  { format: 'umd', outputFolder: 'dist' },
];

export default outputs.map(({ format, outputFolder }) => ({
  input: `src/index.js`,
  output: {
    name: 'HandleIO',
    format,
    file: `${outputFolder}/async-describe.js`,
  },
  plugins: [
    async(),
    nodeResolve({
      main: true,
      module: true,
      jsnext: true,
    }),

    commonjs({
      include: 'node_modules/**',
      extensions: [ '.js' ],
    })
  ]
}))
