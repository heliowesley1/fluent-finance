CREATE TABLE public.finance_data (
  user_id uuid PRIMARY KEY,
  accounts jsonb NOT NULL DEFAULT '[]'::jsonb,
  cards jsonb NOT NULL DEFAULT '[]'::jsonb,
  transactions jsonb NOT NULL DEFAULT '[]'::jsonb,
  budgets jsonb NOT NULL DEFAULT '[]'::jsonb,
  goals jsonb NOT NULL DEFAULT '[]'::jsonb,
  investments jsonb NOT NULL DEFAULT '[]'::jsonb,
  debts jsonb NOT NULL DEFAULT '[]'::jsonb,
  subscriptions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.finance_data TO authenticated;
GRANT ALL ON public.finance_data TO service_role;

ALTER TABLE public.finance_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own finance data"
ON public.finance_data FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own finance data"
ON public.finance_data FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own finance data"
ON public.finance_data FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER finance_data_set_updated_at
BEFORE UPDATE ON public.finance_data
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();