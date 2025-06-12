module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  
  // Create collections for categories
  eleventyConfig.addCollection("academic", function(collectionApi) {
    return collectionApi.getFilteredByTag("academic");
  });
  
  eleventyConfig.addCollection("technology", function(collectionApi) {
    return collectionApi.getFilteredByTag("technology");
  });
  
  eleventyConfig.addCollection("essays", function(collectionApi) {
    return collectionApi.getFilteredByTag("essays");
  });
  
  eleventyConfig.addCollection("book-summaries", function(collectionApi) {
    return collectionApi.getFilteredByTag("book-summaries");
  });
  
  eleventyConfig.addCollection("poetry-fiction", function(collectionApi) {
    return collectionApi.getFilteredByTag("poetry-fiction");
  });
  
  eleventyConfig.addCollection("extracurriculars", function(collectionApi) {
    return collectionApi.getFilteredByTag("extracurriculars");
  });
  
  // Featured posts collection
  eleventyConfig.addCollection("featured", function(collectionApi) {
    return collectionApi.getFilteredByTag("featured");
  });

  eleventyConfig.addPassthroughCopy("src/CNAME");
  
  // Date filter
  eleventyConfig.addFilter("dateDisplay", function(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });
  
  // Limit filter
  eleventyConfig.addFilter("limit", function(array, limit) {
    return array.slice(0, limit);
  });
  
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts"
    }
  };
};