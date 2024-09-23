const path = require('path');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');
const webpack = require('webpack');

const config = {
  name: 'js',
  entry: './src/index.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new webpack.DefinePlugin({
      ENV: JSON.stringify("js")
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(scss|css)$/,
        exclude: [
          /[^/\\]*ckeditor5[^/\\]*[/\\]theme[/\\].+\.css$/
        ],
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /[^/\\]*ckeditor5[^/\\]*[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
        use: ['raw-loader']
      },
      {
        test: /[^/\\]*ckeditor5[^/\\]*[/\\]theme[/\\].+\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              injectType: 'singletonStyleTag',
              attributes: {
                'data-cke': true
              }
            }
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: styles.getPostCssConfig({
                themeImporter: {
                  themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
                },
                minify: true
              })
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|ttf|eot|png|jpg|gif|svg|mp4)$/,
        exclude: [
          /[^/\\]*ckeditor5[^/\\]*[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/
        ],
        type: 'asset/inline',
      }
    ]
  },
  // Attempt to resolve these extensions in order.
  // If multiple files share the same name but have different extensions,
  // webpack will resolve the one with the extension listed first
  // in the array and skip the rest.
  // Use '...' to access the default extensions
  resolve: {
    extensions: ['.jsx', '.js', '...'],
  },
  target: 'node',
  externals: {
    react: 'react',
  }
};

module.exports = (env, argv) => {
  // config.mode production by default (see above); adjust if doing development build
  if (argv.mode === 'development') {
    config.mode = 'development';
    config.devtool = 'eval-source-map';
  }

  // add minification to export if doing a production build
  if (config.mode === 'production') {
    config.optimization = {
      minimize: true
    };
  }

  return config;
};
