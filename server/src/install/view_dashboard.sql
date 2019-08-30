-- View: public.dashboard

-- DROP VIEW public.dashboard;

CREATE OR REPLACE VIEW public.dashboard AS
SELECT 
  profile_id,
  year,
  category,
  SUM(amount) AS amount,
  SUM(budget_amount) AS budget_amount
FROM (
    SELECT profile_id, year, 'transportation' AS category, amount, budget_amount FROM accounting
    WHERE paragraph >= 2200 AND paragraph <= 2299
  UNION
    SELECT profile_id, year, 'schools' AS category, amount, budget_amount FROM accounting
    WHERE paragraph >= 3100 AND paragraph <= 3299
  UNION
    SELECT profile_id, year, 'housing' AS category, amount, budget_amount FROM accounting
    WHERE paragraph = 3612
  UNION
    SELECT profile_id, year, 'culture' AS category, amount, budget_amount FROM accounting
    WHERE paragraph >= 3300 AND paragraph <= 3399
  UNION
    SELECT profile_id, year, 'sports' AS category, amount, budget_amount FROM accounting
    WHERE paragraph >= 3400 AND paragraph <= 3499
  UNION
    SELECT profile_id, year, 'government' AS category, amount, budget_amount FROM accounting
    WHERE paragraph >= 6100 AND paragraph <= 6199
) AS category_accounting
GROUP BY profile_id, year, category;

GRANT SELECT ON dashboard TO PUBLIC;