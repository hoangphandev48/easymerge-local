# API — Cài đặt backend

## Cấu trúc thư mục

```
server/src/
├── modules/products/
│   ├── product.routes.ts       # định nghĩa route
│   ├── product.controller.ts   # nhận request, trả response
│   ├── product.service.ts      # nghiệp vụ
│   ├── product.repository.ts   # truy vấn SQL (parameterized)
│   └── product.schema.ts       # Zod schema
├── middleware/
│   ├── auth.ts                 # xác thực + kiểm tra role admin
│   ├── validate.ts             # validate body/query bằng Zod
│   └── error-handler.ts        # chuyển lỗi thành envelope
└── db/pool.ts
```

Phân tầng:

- **controller**: chỉ đọc request, gọi service, ghi response.
- **service**: nghiệp vụ, chuyển lỗi DB thành lỗi có mã (`SKU_EXISTS`, `NOT_FOUND`).
- **repository**: duy nhất nơi viết SQL.

## Validate

```ts
// product.schema.ts
import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().trim().min(1).max(200),
  sku: z.string().trim().min(1).max(50),
  description: z.string().max(5000).default(''),
  price: z.number().min(0),
  stock: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
})

export const updateProductSchema = createProductSchema
  .partial()
  .refine((v) => Object.keys(v).length > 0, 'Cần ít nhất một trường')
```

## Repository

Luôn dùng truy vấn tham số hóa. Cột `sort` chỉ lấy từ whitelist.

```ts
const SORTABLE: Record<string, string> = {
  createdAt: 'created_at',
  name: 'name',
  price: 'price',
  stock: 'stock',
}

export async function findById(id: string) {
  const { rows } = await pool.query(
    'SELECT * FROM products WHERE id = $1 AND deleted_at IS NULL',
    [id],
  )
  return rows[0] ?? null
}

export async function softDelete(id: string) {
  const { rowCount } = await pool.query(
    'UPDATE products SET deleted_at = now() WHERE id = $1 AND deleted_at IS NULL',
    [id],
  )
  return rowCount > 0
}
```

Cập nhật dùng `UPDATE ... RETURNING *` và trả về bản ghi mới, không sửa object cũ tại chỗ; đồng thời đặt `updated_at = now()`.

## Xử lý lỗi

- Lỗi Postgres `23505` trên `uq_products_sku` → `409 SKU_EXISTS`.
- Lỗi không biết → log chi tiết (kèm request id) ở server, trả `500 INTERNAL_ERROR` với thông điệp chung.
- Không bao giờ trả stack trace hoặc nội dung lỗi SQL ra client.

## Middleware thứ tự

`rate-limit → auth (admin) → validate → controller → error-handler`.

## Kiểm thử

- Unit: schema, service (mock repository).
- Integration: gọi endpoint thật với DB test, dọn dữ liệu sau mỗi test. Các ca cần có: tạo thành công, trùng SKU, không tìm thấy, không có quyền, phân trang/lọc/sắp xếp, xóa mềm.
