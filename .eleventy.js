const markdownItTaskLists = require('markdown-it-task-lists');
const Image = require('@11ty/eleventy-img');
const path = require('node:path');

module.exports = function(eleventyConfig) {

  // ── Markdown ──────────────────────────────────────────────────────────────
  eleventyConfig.amendLibrary("md", mdLib => {
    mdLib.use(markdownItTaskLists);
  });

  // ── Passthrough copy ──────────────────────────────────────────────────────
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/files");
  eleventyConfig.addPassthroughCopy("src/fonts");

  // ── Image shortcode ───────────────────────────────────────────────────────
  // Usage: {% thumb "/images/Foo.png", 400 %}  → returns URL string
  // Width > 600 goes to /images/thumbs/large/, otherwise /images/thumbs/
  eleventyConfig.addAsyncShortcode("thumb", async function(src, width = 400) {
    if (!src) return "";

    const isLarge = width > 600;
    const outputDir = isLarge
      ? "./_site/images/thumbs/large/"
      : "./_site/images/thumbs/";
    const urlPath = isLarge
      ? "/images/thumbs/large/"
      : "/images/thumbs/";

    const inputPath = `./src${src}`;

    let metadata;
    try {
      metadata = await Image(inputPath, {
        widths: [width],
        formats: ["jpeg"],
        outputDir,
        urlPath,
        sharpJpegOptions: { quality: 88 },
        filenameFormat: function(_id, src) {
          return path.basename(src, path.extname(src)) + ".jpg";
        },
      });
    } catch (e) {
      console.warn(`[thumb] Could not process ${inputPath}: ${e.message}`);
      // Fall back to old thumb path so broken images don't break the build
      const base = path.basename(src, path.extname(src));
      return `${urlPath}${base}.jpg`;
    }

    return metadata.jpeg[0].url;
  });

  // ── Collections ───────────────────────────────────────────────────────────
  eleventyConfig.addCollection("projects", function(collectionApi) {
    return collectionApi.getFilteredByTag("projects").sort((a, b) => {
      return b.inputPath.localeCompare(a.inputPath);
    });
  });

  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByTag("posts").sort((a, b) => {
      return b.inputPath.localeCompare(a.inputPath);
    });
  });

  // ── Filters ───────────────────────────────────────────────────────────────
  eleventyConfig.addFilter("date", function(date, format) {
    const d = new Date(date);
    const months = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
    if (format === "%B %d, %Y") {
      return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    }
    return date;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};
