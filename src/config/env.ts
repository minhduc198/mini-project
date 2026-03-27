const requiredEnv = ["NEXT_PUBLIC_BASE_URL"] as const;

type EnvKey = (typeof requiredEnv)[number];

function getEnv(key: EnvKey): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}

export const env = {
  BASE_URL: getEnv("NEXT_PUBLIC_BASE_URL"),
};
