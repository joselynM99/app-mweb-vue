const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    port: 3000,
    client: {
      overlay: {
        warnings: false,
        errors: false
      }
    }
  },

  pluginOptions: {
    vuetify: {
      // Configuración de vuetify, si aplica
    }
  }
})
