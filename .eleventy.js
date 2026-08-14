const markdownItTaskLists = require('markdown-it-task-lists');
const path = require('node:path');

// eleventy-img is ESM-only since v7, so it has to be imported dynamically.
// Loaded once on first use and reused for every subsequent thumb.
let imagePromise;
function loadImage() {
  if (!imagePromise) imagePromise = import('@11ty/eleventy-img').then(m => m.default);
  return imagePromise;
}

module.exports = function(eleventyConfig) {

  // Don't let .gitignore control what Eleventy builds. src/cover_letters/ is
  // gitignored (kept out of the public repo) but still needs to be built
  // locally for PDF export. See .eleventyignore for what Eleventy itself skips.
  eleventyConfig.setUseGitIgnore(false);

  // ── Markdown ──────────────────────────────────────────────────────────────
  eleventyConfig.amendLibrary("md", mdLib => {
    mdLib.use(markdownItTaskLists);
  });

  // ── Passthrough copy ──────────────────────────────────────────────────────
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/files");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy({ "src/favicon": "/" });

  // ── Image shortcode ───────────────────────────────────────────────────────
  // Shared thumb generator — used by both the shortcode and the filter
  async function generateThumb(src, width = 400) {
    if (!src) return "";
    const isLarge = width > 600;
    const outputDir = isLarge ? "./_site/images/thumbs/large/" : "./_site/images/thumbs/";
    const urlPath   = isLarge ? "/images/thumbs/large/"        : "/images/thumbs/";
    const inputPath = `./src${src}`;
    try {
      const Image = await loadImage();
      const metadata = await Image(inputPath, {
        widths: [width],
        formats: ["webp"],
        outputDir,
        urlPath,
        sharpWebpOptions: { quality: 88 },
        filenameFormat: (_id, src) => path.basename(src, path.extname(src)) + ".webp",
      });
      return metadata.webp[0].url;
    } catch (e) {
      console.warn(`[thumb] Could not process ${inputPath}: ${e.message}`);
      return `${urlPath}${path.basename(src, path.extname(src))}.webp`;
    }
  }

  // {% thumb "/images/Foo.png", 400 %}  — for use with string literals in templates
  eleventyConfig.addAsyncShortcode("thumb", generateThumb);

  // {{ someVar | thumbUrl: 400 }}  — for use with Liquid variables in loops
  eleventyConfig.addFilter("thumbUrl", generateThumb);

  // ── Collections ───────────────────────────────────────────────────────────
  eleventyConfig.addCollection("projects", function(collectionApi) {
    return collectionApi.getFilteredByTag("projects").sort((a, b) => {
      if (a.data.pinned && !b.data.pinned) return -1;
      if (!a.data.pinned && b.data.pinned) return 1;
      return b.inputPath.localeCompare(a.inputPath);
    });
  });

  eleventyConfig.addCollection("postsSorted", function(collectionApi) {
    return collectionApi.getFilteredByTag("posts")
      .filter(p => !p.data.eleventyExcludeFromCollections)
      .sort((a, b) => b.date - a.date);
  });

  // ── Filters ───────────────────────────────────────────────────────────────
  // Page titles double as on-page headings and carry a leading emoji. Strip it
  // for <title> and social meta, where it just adds noise.
  eleventyConfig.addFilter("stripEmoji", function(str) {
    if (!str) return "";
    return String(str)
      .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{20E3}]/gu, "")
      .replace(/\s+/g, " ")
      .trim();
  });

  eleventyConfig.addFilter("absoluteUrl", function(url, base) {
    if (!url) return "";
    if (/^https?:\/\//.test(url)) return url;
    return `${String(base).replace(/\/$/, "")}${url.startsWith("/") ? "" : "/"}${url}`;
  });

  eleventyConfig.addFilter("date", function(date, format) {
    const d = new Date(date);
    const months = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
    if (format === "%B %d, %Y") {
      return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    }
    if (format === "%Y-%m-%d") {
      return d.toISOString().slice(0, 10);
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
