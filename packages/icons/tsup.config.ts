import { defineConfig } from 'tsup';
import { globSync } from 'glob';

export default defineConfig({
  entry: globSync('src/*.ts'),
  format: ['esm'],
  dts: true,
  splitting: true,
  treeshake: true,
  clean: true,
  external: ['react', 'react-icons'],
});