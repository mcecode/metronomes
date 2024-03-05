import type { UserConfig } from "vite";

import htmlMinimize from "@sergeymakinen/vite-plugin-html-minimize";

const serverOptions = {
  host: "0.0.0.0",
  port: 6001,
  strictPort: true
};

export default <UserConfig>{
  server: serverOptions,
  preview: serverOptions,
  plugins: [
    htmlMinimize({
      minifierOptions: {
        collapseWhitespace: true,
        html5: true,
        minifyCSS: true,
        minifyJS: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    })
  ]
};
