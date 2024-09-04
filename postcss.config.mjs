/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {}
  }
};

if (process.env.NODE_ENV === "production") {
  Object.assign(config.plugins, {
    autoprefixer: {},
    cssnano: {
      preset: ["default", { discardComments: { removeAll: true } }]
    }
  });
}

export default config;
