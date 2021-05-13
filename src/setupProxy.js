// @ts-ignore
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/authServiceAddress',
        createProxyMiddleware({
            target: process.env.REACT_APP_AUTH_SERVICE_ADDRESS,
            changeOrigin: true,
            pathRewrite: {
                '/authServiceAddress': '/'
            }
        })
    );

    app.use(
        '/apiAddress',
        createProxyMiddleware({
            target: process.env.REACT_APP_API_ADDRESS,
            changeOrigin: true,
            pathRewrite: {
                '/apiAddress': '/'
            }
        })
    );

  app.use(
    '/nodeAddress',
    createProxyMiddleware({
      target: process.env.REACT_APP_NODE_ADDRESS,
      changeOrigin: true,
      pathRewrite: {
        '/nodeAddress': '/'
      }
    })
  );
};
