import pkg from './package.json';

function pgl(plugins = []) {
  return [
    ...plugins
  ];
}

export default [
  {
    input: 'lib/index.js',
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'es', sourcemap: true }
    ],
    plugins: pgl()
  }
];