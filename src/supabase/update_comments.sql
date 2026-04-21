-- Add product_id column to comments table to allow per-sample commenting
alter table comments add column if not exists product_id text;

-- Update RLS policies is not needed as they already cover all comments
