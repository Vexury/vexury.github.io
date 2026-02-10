module.exports = function(eleventyConfig) {
  // Copy CSS to output
  eleventyConfig.addPassthroughCopy("src/css");
  
  // Copy any images or assets
  eleventyConfig.addPassthroughCopy("src/images");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};