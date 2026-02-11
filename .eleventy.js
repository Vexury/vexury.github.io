module.exports = function(eleventyConfig) {
  // Copy CSS to output
  eleventyConfig.addPassthroughCopy("src/css");
  
  // Copy any images or assets
  eleventyConfig.addPassthroughCopy("src/images");

  // Copy files (resume, etc.)
  eleventyConfig.addPassthroughCopy("src/files");

  // Projects collection sorted by filename (descending)
  eleventyConfig.addCollection("projects", function(collectionApi) {
    return collectionApi.getFilteredByTag("projects").sort((a, b) => {
      return b.inputPath.localeCompare(a.inputPath);
    });
  });

  // Posts collection sorted by filename (descending)
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByTag("posts").sort((a, b) => {
      return b.inputPath.localeCompare(a.inputPath);
    });
  });

  // Add date filter
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