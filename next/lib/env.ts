export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  githubClientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || '',
};

export function hasEnv() {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}
