import { defineConfig } from 'vite'

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    return {
      root: './cypress/e2e/file-tree-view/' 
      // dev specific config
    }
  } else {
    // command === 'build'
    return {
      // build specific config
    }
  }
})