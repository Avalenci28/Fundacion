const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const PLACEHOLDER = '/placeholder.jpg';

export function getPlaceholderImage(): string {
  return PLACEHOLDER;
}

function isProbablyAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function normalizePath(path: string): string {
  // Remove whitespace and normalize
  const cleaned = path.trim();
  return cleaned;
}

// Normaliza el valor retornado por el backend (relativo/absoluto) a una URL válida para <img> / next/image
export function getImageUrl(path?: string | null): string {
  if (!path) return PLACEHOLDER;

  const cleaned = normalizePath(path);
  if (!cleaned) return PLACEHOLDER;

  // Already an absolute URL
  if (isProbablyAbsoluteUrl(cleaned)) return cleaned;

  // Handle backend returning something like: "uploads/file.png" (sin / inicial)
  if (cleaned.startsWith('uploads/')) {
    return `${BACKEND_URL}/${cleaned}`;
  }

  // Handle relative URLs with leading slash: "/uploads/file.png"
  if (cleaned.startsWith('/')) {
    return `${BACKEND_URL}${cleaned}`;
  }

  // Handle relative URLs without leading slash: "images/file.png"
  return `${BACKEND_URL}/${cleaned}`;
}

