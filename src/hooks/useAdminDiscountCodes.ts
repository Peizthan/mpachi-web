import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { supabase } from '@/supabaseClient';

export interface DiscountCode {
  id: string;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  currency: string;
  max_uses: number | null;
  current_uses: number;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DiscountCodeInput {
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  currency: string;
  max_uses: string; // empty string = unlimited
  valid_from: string;   // empty = no limit
  valid_until: string;  // empty = no limit
  is_active: boolean;
}

export const getDefaultDiscountInput = (): DiscountCodeInput => ({
  code: '',
  description: '',
  discount_type: 'percentage',
  discount_value: 10,
  currency: 'usd',
  max_uses: '',
  valid_from: '',
  valid_until: '',
  is_active: true,
});

export const useAdminDiscountCodes = () => {
  const { user } = useAuthContext();
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchCodes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('discount_codes')
        .select('*')
        .order('created_at', { ascending: false });
      if (fetchError) throw fetchError;
      setCodes((data ?? []) as DiscountCode[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar códigos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  const createCode = async (input: DiscountCodeInput) => {
    if (!user) return { error: new Error('Sin sesión activa') };
    try {
      setSavingId('new');
      setError(null);

      const { data, error: createError } = await supabase
        .from('discount_codes')
        .insert({
          code: input.code.trim().toUpperCase(),
          description: input.description.trim() || null,
          discount_type: input.discount_type,
          discount_value: input.discount_value,
          currency: input.currency.trim().toLowerCase() || 'usd',
          max_uses: input.max_uses === '' ? null : Number(input.max_uses),
          valid_from: input.valid_from || null,
          valid_until: input.valid_until || null,
          is_active: input.is_active,
          created_by: user.id,
        })
        .select('*')
        .single();

      if (createError) throw createError;
      setCodes((prev) => [data as DiscountCode, ...prev]);
      return { error: null };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear código');
      return { error: err };
    } finally {
      setSavingId(null);
    }
  };

  const updateCode = async (id: string, input: DiscountCodeInput) => {
    try {
      setSavingId(id);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('discount_codes')
        .update({
          code: input.code.trim().toUpperCase(),
          description: input.description.trim() || null,
          discount_type: input.discount_type,
          discount_value: input.discount_value,
          currency: input.currency.trim().toLowerCase() || 'usd',
          max_uses: input.max_uses === '' ? null : Number(input.max_uses),
          valid_from: input.valid_from || null,
          valid_until: input.valid_until || null,
          is_active: input.is_active,
        })
        .eq('id', id)
        .select('*')
        .single();

      if (updateError) throw updateError;
      setCodes((prev) => prev.map((c) => (c.id === id ? (data as DiscountCode) : c)));
      return { error: null };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar código');
      return { error: err };
    } finally {
      setSavingId(null);
    }
  };

  const toggleActive = async (code: DiscountCode) => {
    try {
      setSavingId(code.id);
      const { error: updateError } = await supabase
        .from('discount_codes')
        .update({ is_active: !code.is_active })
        .eq('id', code.id);
      if (updateError) throw updateError;
      setCodes((prev) =>
        prev.map((c) => (c.id === code.id ? { ...c, is_active: !code.is_active } : c))
      );
      return { error: null };
    } catch (err) {
      return { error: err };
    } finally {
      setSavingId(null);
    }
  };

  const deleteCode = async (id: string) => {
    try {
      setSavingId(id);
      const { error: deleteError } = await supabase
        .from('discount_codes')
        .delete()
        .eq('id', id);
      if (deleteError) throw deleteError;
      setCodes((prev) => prev.filter((c) => c.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err };
    } finally {
      setSavingId(null);
    }
  };

  return { codes, loading, error, savingId, fetchCodes, createCode, updateCode, toggleActive, deleteCode };
};
