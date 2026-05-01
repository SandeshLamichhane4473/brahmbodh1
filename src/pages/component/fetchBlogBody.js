export const fetchBlogBody = async (url) => {
  if (!url) return "<p style='color:red;'>Invalid URL</p>";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error("Error fetching blog body:", error);
    return "<p style='color:red;'>Failed to load content.</p>";
  }
};