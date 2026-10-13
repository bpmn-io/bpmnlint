import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import bpmnlint from 'rollup-plugin-bpmnlint';
import json from '@rollup/plugin-json';

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
    json(),
    bpmnlint()
  ]
};