ALTER TABLE eg_pqm_tests ADD COLUMN IF NOT EXISTS testCode VARCHAR(255);

ALTER TABLE eg_pqm_tests_auditlog ADD COLUMN IF NOT EXISTS testCode VARCHAR(255);