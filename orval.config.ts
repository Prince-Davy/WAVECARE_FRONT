import { defineConfig } from 'orval';

export default defineConfig({
  wavecare: {
    input: {
      target: '../WAVECARE_BACK/target/openapi.json',
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
