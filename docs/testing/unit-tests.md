# Test đơn vị

Áp dụng cho hàm thuần và class không phụ thuộc HTTP.

- Mỗi `it` kiểm tra một hành vi, tên mô tả bằng tiếng Việt.
- Dùng `it.each` cho bảng đầu vào sai.
- Dùng `beforeEach` tạo repository mới để các test độc lập.
- Truyền `now` vào `stats(now)` khi cần kiểm soát thời gian.

Xem thêm [validation-tests.md](validation-tests.md) và [repository-tests.md](repository-tests.md).
