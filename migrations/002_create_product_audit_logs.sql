CREATE TABLE product_audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID         NOT NULL,
  actor       VARCHAR(100) NOT NULL,
  action      VARCHAR(10)  NOT NULL CHECK (action IN ('create', 'update', 'delete')),
  before      JSONB,
  after       JSONB,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_audit_logs_product ON product_audit_logs (product_id, created_at DESC);
