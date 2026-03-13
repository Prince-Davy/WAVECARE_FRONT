import { defineConfig } from 'orval';

export default defineConfig({
  wavecare: {
    input: {
      target: './openapi.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/app/api/generated',
      schemas: './src/app/api/model',
      client: 'angular',
      clean: true,
    },
  },
});
