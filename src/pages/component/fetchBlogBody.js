const CACHE_EXPIRY_MS = 3 * 60 * 60 * 1000; // 3 hours

export const fetchBlogBody = async (url) => {
  if (!url) return "<p style='color:red;'>Invalid URL</p>";

  const CACHE_KEY = `blogBodyCache_${encodeURIComponent(url)}`;

  // Try loading from localStorage
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { content, timestamp } = JSON.parse(cached);
      const isFresh = Date.now() - timestamp < CACHE_EXPIRY_MS;

      if (isFresh) {
        console.log("i am from cached")
        return content;
      } else {
        localStorage.removeItem(CACHE_KEY); // Remove stale cache
      }
    }
  } catch (err) {
    alert(err)
    console.warn("Corrupt cache or parsing error:", err);
  }

  // If no valid cache, fetch from the network
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const text = await response.text();
   
    // Save to localStorage
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ content: text, timestamp: Date.now() })
    );
    console.log("i am realtime")
    return text;
  } catch (error) {
    console.error("Error fetching blog body:", error);
    return "<p style='color:red;'>Failed to load content.</p>";
  }
};
