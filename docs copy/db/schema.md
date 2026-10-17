# DB — Schema

PostgreSQL. Xem quy ước chung tại [conventions.md](conventions.md).

## Bảng `products`

| Cột | Kiểu | Ràng buộc | Ghi chú |
|-----|------|-----------|---------|
| `id` | UUID | PK, default `gen_random_uuid()` | |
| `name` | VARCHAR(200) | NOT NULL | Tên sản phẩm |
| `sku` | VARCHAR(50) | NOT NULL, duy nhất khi chưa xóa | Mã sản phẩm |
| `description` | TEXT | NOT NULL, default `''` | |
| `price` | NUMERIC(12,2) | NOT NULL, `>= 0` | |
| `stock` | INTEGER | NOT NULL, default 0, `>= 0` | |
| `status` | VARCHAR(20) | NOT NULL, default `draft`, thuộc `draft/active/archived` | |
| `created_at` | TIMESTAMPTZ | NOT NULL, default `now()` | |
| `updated_at` | TIMESTAMPTZ | NOT NULL, default `now()` | |
| `deleted_at` | TIMESTAMPTZ | NULL | Có giá trị = đã xóa mềm |

## SQL

```sql
CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(200)   NOT NULL,
  sku         VARCHAR(50)    NOT NULL,
  description TEXT           NOT NULL DEFAULT '',
  price       NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  stock       INTEGER        NOT NULL DEFAULT 0 CHECK (stock >= 0),
  status      VARCHAR(20)    NOT NULL DEFAULT 'draft'
              CHECK (status IN ('draft', 'active', 'archived')),
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ    NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMPTZ
);

CREATE UNIQUE INDEX uq_products_sku ON products (sku) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_status ON products (status) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_created_at ON products (created_at DESC);
```

## Index

| Index | Mục đích |
|-------|----------|
| `uq_products_sku` (partial) | SKU duy nhất trong số bản ghi chưa xóa; cho phép tái sử dụng SKU sau khi xóa |
| `idx_products_status` (partial) | Lọc theo trạng thái |
| `idx_products_created_at` | Sắp xếp mặc định `-created_at` |

Nếu tìm kiếm `ILIKE` trên `name` chậm khi dữ liệu lớn, cân nhắc extension `pg_trgm` với GIN index.
