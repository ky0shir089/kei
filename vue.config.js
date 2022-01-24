module.exports = {
  transpileDependencies: [
    'vuetify'
  ],

  pluginOptions: {
    moment: {
      locales: [
        'id'
      ]
    }
  },

  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = "Komunitas Excel Indonesia";
        return args;
      })

    config
      .output
      .filename('[name].[hash].bundle.js')
  },
}
