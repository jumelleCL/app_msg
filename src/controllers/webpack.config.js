const path = require('path');

module.exports = {
  entry: './src/index.js', // Archivo principal de entrada
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Carpeta de salida para el bundle
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Para transpilar el código con Babel
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};