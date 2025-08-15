import type { MinifierOptions } from "html-minifier-next";
import type { UserConfig } from "vite";

import { minify } from "html-minifier-next";
import { createFilter } from "vite";

const filter = createFilter("**/*.html");
const options: MinifierOptions = {
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
};

export default <UserConfig>{
  plugins: [
    {
      // Yoinked from `@sergeymakinen/vite-plugin-html-minimize` with some
      // changes.
      name: "html-minifier",
      apply: "build",
      enforce: "post",
      generateBundle: {
        order: "post",
        async handler(_, bundle) {
          for (const assetOrChunk of Object.values(bundle)) {
            if (
              assetOrChunk.type === "asset" &&
              filter(assetOrChunk.fileName)
            ) {
              assetOrChunk.source = await minify(
                assetOrChunk.source.toString(),
                options
              );
            }
          }
        }
      }
    }
  ]
};
