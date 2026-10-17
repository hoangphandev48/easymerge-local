# Screen — Danh sách sản phẩm

Route: `/admin/products`. Component: `ProductListPage` + `ProductTable`.

## Bố cục

```
┌──────────────────────────────────────────────────────────┐
│ Sản phẩm                                [ + Thêm sản phẩm ]│
├──────────────────────────────────────────────────────────┤
│ [ Tìm theo tên/SKU… ]  [ Trạng thái ▾ ]                  │
├──────────────────────────────────────────────────────────┤
│ Tên      SKU     Giá      Tồn  Trạng thái  Ngày tạo  ⋯  │
│ ...                                                      │
├──────────────────────────────────────────────────────────┤
│ 134 sản phẩm              ‹ 1 2 3 … 7 ›                  │
└──────────────────────────────────────────────────────────┘
```

## Cột bảng

| Cột | Ghi chú |
|-----|---------|
| Tên | Liên kết tới trang chỉnh sửa; sắp xếp được |
| SKU | |
| Giá | Định dạng tiền tệ theo locale; sắp xếp được |
| Tồn kho | Sắp xếp được |
| Trạng thái | Badge: draft (xám), active (xanh), archived (vàng); không chỉ dựa vào màu, luôn kèm chữ |
| Ngày tạo | Sắp xếp được, mặc định giảm dần |
| Thao tác | Sửa, Xóa |

## Hành vi

- Dữ liệu từ `GET /api/products` qua `useProducts`.
- Trạng thái `page`, `q`, `status`, `sort` lưu trên URL; tải lại trang vẫn giữ.
- Ô tìm kiếm debounce 300 ms; đổi tìm kiếm hoặc bộ lọc thì về trang 1.
- Nhấn tiêu đề cột để đổi sắp xếp (tăng → giảm); tiêu đề có `aria-sort`.
- Nút **Xóa** mở [hộp thoại xác nhận](delete-dialog.md).
- Nút **Thêm sản phẩm** chuyển tới `/admin/products/new`.

## Các trạng thái

| Trạng thái | Hiển thị |
|------------|----------|
| Đang tải | Skeleton các dòng, giữ nguyên chiều cao để tránh nhảy layout |
| Rỗng (không có dữ liệu) | "Chưa có sản phẩm" + nút Thêm sản phẩm |
| Rỗng (do bộ lọc) | "Không tìm thấy kết quả" + nút Xóa bộ lọc |
| Lỗi | Thông báo + nút Thử lại |

## Responsive

- Từ 768px trở lên: bảng đầy đủ cột.
- Dưới 768px: bảng cuộn ngang trong vùng chứa riêng, hoặc chuyển mỗi dòng thành thẻ; không để trang bị tràn ngang.
