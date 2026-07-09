import { createClient } from '@/lib/supabase/server';

export async function getCreditBalance(userId: string) {
  const supabase = await createClient();
  if (!supabase) return 0;
  const { data } = await supabase
    .from('credits')
    .select('balance')
    .eq('user_id', userId)
    .single();
  return data?.balance ?? 0;
}

export async function deductCredits(userId: string, amount: number, description?: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Supabase not configured');
  const { data: current } = await supabase
    .from('credits')
    .select('balance')
    .eq('user_id', userId)
    .single();

  if (!current || current.balance < amount) {
    throw new Error('Insufficient credits');
  }

  const { error } = await supabase
    .from('credits')
    .update({ balance: current.balance - amount })
    .eq('user_id', userId);

  if (error) throw error;

  await supabase.from('credit_transactions').insert({
    user_id: userId,
    amount: -amount,
    type: 'generation',
  });

  return current.balance - amount;
}

export async function addCredits(userId: string, amount: number) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Supabase not configured');
  const { data: current } = await supabase
    .from('credits')
    .select('balance')
    .eq('user_id', userId)
    .single();

  const newBalance = (current?.balance ?? 0) + amount;

  const { error } = await supabase
    .from('credits')
    .upsert({ user_id: userId, balance: newBalance });

  if (error) throw error;

  await supabase.from('credit_transactions').insert({
    user_id: userId,
    amount,
    type: 'purchase',
  });

  return newBalance;
}
