export const generateSlug = (text = "") => {
  return text
    .normalize("NFC")
    .trim()
    .replace(/[^\u0900-\u097F\w\s-]/g, "") // Devanagari + Latin + digits
    .replace(/\s+/g, "-") // spaces → hyphen
    .replace(/-+/g, "-") // multiple hyphens → single
    .replace(/^-|-$/g, "") // trim hyphens
    .toLowerCase();
};