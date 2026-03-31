const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!NEXT_PUBLIC_BASE_URL) {
  const errorMsg = '[Environment Error] Missing required environment variable: NEXT_PUBLIC_BASE_URL';
  throw new Error(errorMsg);
}

export const env = {
  BASE_URL: NEXT_PUBLIC_BASE_URL,
} as const;
