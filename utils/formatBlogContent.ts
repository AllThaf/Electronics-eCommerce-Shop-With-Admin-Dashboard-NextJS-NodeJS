// Function to process blog content and preserve paragraphs
export function formatBlogContent(content: string): string {
  // Split content into paragraphs (double newlines)
  const paragraphs = content.split(/\n\s*\n/);
  
  // Wrap each paragraph in <p> tags
  return paragraphs
    .map(p => `<p class="mb-6">${p.trim()}</p>`)
    .join('\n');
}