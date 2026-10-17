# Screen — Hộp thoại xác nhận xóa

Component: `ConfirmDeleteDialog`. Mở từ nút **Xóa** ở [danh sách](product-list.md).

## Nội dung

- Tiêu đề: "Xóa sản phẩm?"
- Mô tả: "Sản phẩm **{tên}** sẽ bị xóa. Bạn có thể nhờ quản trị viên khôi phục sau."
- Nút: **Hủy** (mặc định được focus), **Xóa** (kiểu nguy hiểm).

## Hành vi

- Xác nhận gọi `DELETE /api/products/:id`.
- Trong lúc gọi: nút Xóa bị vô hiệu hóa và hiện trạng thái đang xử lý.
- Thành công (`204`): đóng dialog, toast "Đã xóa", invalidate danh sách. Nếu trang hiện tại hết dòng thì lùi về trang trước.
- Có thể dùng optimistic update: gỡ dòng khỏi bảng ngay, hoàn lại dòng và báo lỗi nếu API thất bại.
- `404`: coi như đã xóa, đóng dialog và làm mới danh sách.
- Lỗi khác: giữ dialog mở, hiện thông báo lỗi.

## Accessibility

- `role="alertdialog"` với `aria-labelledby` (tiêu đề) và `aria-describedby` (mô tả).
- Focus bị giữ trong dialog; `Esc` hoặc nhấn Hủy để đóng; trả focus về nút Xóa ban đầu khi đóng.
- Nền phía sau không tương tác được khi dialog mở.
