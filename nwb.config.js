var path = require('path')
module.exports = {
  type: "react-component",
  npm: {
    esModules: true,
    umd: false,
  },
  webpack: {
    aliases: {
      react: path.resolve('./node_modules/react'),
    },
  },
  devServer: {
    https: false
  }
};
