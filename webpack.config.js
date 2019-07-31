'use strict'

const { join } = require('path')

const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const EventHooksPlugin = require('event-hooks-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

// Detect mode
//~~~~~~~~~~~~~~~
const isDev = process.argv.includes('--watch')
const mode = isDev ? 'development' : 'production'

// Set SASS variables
//~~~~~~~~~~~~~~~~~~~~~~
const siteUrl = isDev ? '/appview' : '//emoji-gen.ninja/appview';

module.exports = {
  mode,

  // Entry and Context
  //~~~~~~~~~~~~~~~~~~~~
  context: __dirname,
  entry: './src/main.js',


  // Output
  //~~~~~~~~~
  output: {
    filename: 'dist/script.js',
    path: join(__dirname),
  },


  // Module
  //~~~~~~~~~
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { url: false },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { url: false },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              data: `
                $site-url: '${siteUrl}';
              `,
              includePaths: [ join(__dirname, 'src') ],
            },
          },
        ],
      },
    ]
  },


  // Resolve
  //~~~~~~~~~~
  resolve: {
    alias: {
      '@': __dirname,
    },
    extensions: ['.js'],
  },


  // Optimization and Plugins
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        parallel: true,
      }),
    ],
    noEmitOnErrors: true,
  },
  plugins: [
    new CleanWebpackPlugin({
      dry: false,
      dangerouslyAllowCleanPatternsOutsideProject: true,
      cleanOnceBeforeBuildPatterns: [
        join(__dirname, 'public/**/*.css'),
        join(__dirname, 'dist/**/*'),
      ],
      verbose: false,
    }),
    new EventHooksPlugin({
      run() { console.log('Mode: ' + mode) },
      watchRun() { console.log('Mode: ' + mode) },
    }),
    new MiniCssExtractPlugin({ filename: 'public/appview/style.css' }),
    new webpack.DefinePlugin({ DEBUG: isDev }),
  ],


  // Watch and WatchOptions
  //~~~~~~~~~~~~~~~~~~~~~~~~~
  watchOptions: {
    poll: true,
    ignored: [ /node_modules/ ],
  },


  // Performance
  //~~~~~~~~~~~~~~~
  performance: {
    hints: false,
  },


  // Stats
  //~~~~~~~~
  stats: {
    entrypoints: true,
    children: false,
    colors: true,
    modules: false,
  },
}
