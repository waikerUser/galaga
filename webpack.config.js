const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/', // 루트 경로로 변경!
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              api: 'modern',
              sassOptions: {
                outputStyle: 'compressed',
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: '🕹️ Mini Arcade - Classic Arcade Games',
      meta: {
        description:
          'Play classic arcade games for free! Enjoy nostalgic games like Galaga, Tetris, Snake and more directly in your browser.',
        keywords:
          'arcade games, free games, galaga, tetris, snake, classic games, browser games, online games, retro games',
        author: 'Mini Arcade Team',
        viewport:
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
        'theme-color': '#1a1a2e',
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/robots.txt', to: 'robots.txt' },
        { from: 'public/sitemap.xml', to: 'sitemap.xml' },
        { from: 'public/favicon.ico', to: 'favicon.ico' },
        {
          from: 'public',
          to: '',
          globOptions: { ignore: ['**/*.txt', '**/*.xml', '**/*.ico'] },
        },
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3000,
    hot: true,
  },
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimize: true,
  },
};
