var path = require('path')
module.exports = {
  type: "react-component",
  npm: {
    esModules: false,
    umd: false,
  },
  webpack: {
    aliases: {
      react: path.resolve('./node_modules/react'),
    },
  },
  devServer: {
    https: true
  }
};
