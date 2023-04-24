/* eslint-env node */

import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import bpmnlint from 'rollup-plugin-bpmnlint';

export default {
  input: './src/app.js',
  output: {
    name: 'App',
    file: 'dist/app.rollup.js',
    format: 'iife'
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    bpmnlint()
  ]
};