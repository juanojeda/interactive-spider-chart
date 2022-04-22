const CracoLinariaPlugin = require("craco-linaria3");

module.exports = {
  plugins: [
    {
      plugin: CracoLinariaPlugin,
      options: {
        displayName: true
      }
    }
  ]
};
