# Quy ước viết mã

## Kiểu dữ liệu

- Hàm export có kiểu tham số và kiểu trả về rõ ràng.
- Dùng `interface` cho hình dạng object, `type` cho union.
- Dùng union literal thay cho `enum`.
- Dữ liệu ngoài vào là `unknown`, thu hẹp bằng validation.

## Bất biến

Không sửa object tại chỗ; xem [../architecture/immutability.md](../architecture/immutability.md).

## Lỗi và log

- Không `console.log` trong mã nghiệp vụ; lỗi 500 được log ở `errorHandler`.
- Không nuốt lỗi im lặng.

## Comment

Comment bằng tiếng Việt, ngắn, giải thích lý do thay vì lặp lại mã.
