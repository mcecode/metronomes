import type { UserConfig } from "vite";

import htmlMinimize from "@sergeymakinen/vite-plugin-html-minimize";

export default <UserConfig>{
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
