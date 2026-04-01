export const normalizeString = (value: string): string => {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, "") // Remove punctuation and special characters
    .toLowerCase()
    .trim();
};