import { describe, it, expect, beforeEach } from "vitest";
import { TodoRepository } from "./todo.repository.js";

describe("TodoRepository", () => {
  let repo: TodoRepository;

  beforeEach(() => {
    repo = new TodoRepository();
  });

  it("bắt đầu với danh sách rỗng", () => {
    expect(repo.findAll()).toEqual([]);
  });

  it("tạo todo mới với completed = false", () => {
    const todo = repo.create({ title: "Học TypeScript" });
    expect(todo.title).toBe("Học TypeScript");
    expect(todo.completed).toBe(false);
    expect(todo.id).toBeTruthy();
    expect(repo.findAll()).toHaveLength(1);
  });

  it("tìm todo theo id", () => {
    const created = repo.create({ title: "A" });
    expect(repo.findById(created.id)).toEqual(created);
    expect(repo.findById("không-tồn-tại")).toBeUndefined();
  });

  it("lọc theo trạng thái completed", () => {
    const a = repo.create({ title: "A" });
    repo.create({ title: "B" });
    repo.update(a.id, { completed: true });

    expect(repo.findAll({ completed: true })).toHaveLength(1);
    expect(repo.findAll({ completed: false })).toHaveLength(1);
    expect(repo.findAll()).toHaveLength(2);
  });

  it("cập nhật todo mà không làm thay đổi object gốc (bất biến)", () => {
    const created = repo.create({ title: "A" });
    const updated = repo.update(created.id, { completed: true });
    expect(updated?.completed).toBe(true);
    expect(created.completed).toBe(false); // object gốc không bị đổi
    expect(updated?.updatedAt).toBeTruthy();
  });

  it("trả về undefined khi cập nhật id không tồn tại", () => {
    expect(repo.update("x", { completed: true })).toBeUndefined();
  });

  it("xóa todo", () => {
    const created = repo.create({ title: "A" });
    expect(repo.delete(created.id)).toBe(true);
    expect(repo.findAll()).toHaveLength(0);
    expect(repo.delete(created.id)).toBe(false);
  });
});
