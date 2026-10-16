import { describe, it, expect, beforeEach } from "vitest";
import { TodoRepository } from "./todo.repository.js";
import type { TodoQuery } from "./todo.types.js";

const baseQuery: TodoQuery = { sort: "createdAt", order: "asc", page: 1, limit: 20 };

describe("TodoRepository", () => {
  let repo: TodoRepository;

  beforeEach(() => {
    repo = new TodoRepository();
  });

  it("bắt đầu với danh sách rỗng", () => {
    expect(repo.findAll()).toEqual([]);
    expect(repo.search(baseQuery)).toEqual({ items: [], total: 0, page: 1, limit: 20 });
  });

  it("tạo todo mới với completed = false", () => {
    const todo = repo.create({ title: "Học TypeScript" });
    expect(todo.title).toBe("Học TypeScript");
    expect(todo.completed).toBe(false);
    expect(todo.priority).toBe("medium");
    expect(todo.dueDate).toBeNull();
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
  it("tạo todo với priority và dueDate", () => {
    const todo = repo.create({ title: "A", priority: "high", dueDate: "2030-01-01T00:00:00.000Z" });
    expect(todo.priority).toBe("high");
    expect(todo.dueDate).toBe("2030-01-01T00:00:00.000Z");
  });

  it("cập nhật priority và xóa dueDate", () => {
    const created = repo.create({ title: "A", dueDate: "2030-01-01T00:00:00.000Z" });
    const updated = repo.update(created.id, { priority: "low", dueDate: null });
    expect(updated).toMatchObject({ priority: "low", dueDate: null });
  });

  describe("search", () => {
    it("tìm theo title không phân biệt hoa thường", () => {
      repo.create({ title: "Mua sữa" });
      repo.create({ title: "Học bài" });
      const result = repo.search({ ...baseQuery, q: "MUA" });
      expect(result.total).toBe(1);
      expect(result.items[0]?.title).toBe("Mua sữa");
    });

    it("sắp xếp theo priority", () => {
      repo.create({ title: "low", priority: "low" });
      repo.create({ title: "high", priority: "high" });
      repo.create({ title: "mid", priority: "medium" });
      const titles = (order: "asc" | "desc") =>
        repo.search({ ...baseQuery, sort: "priority", order }).items.map((t) => t.title);
      expect(titles("desc")).toEqual(["high", "mid", "low"]);
      expect(titles("asc")).toEqual(["low", "mid", "high"]);
    });

    it("đặt todo không có dueDate xuống cuối ở cả hai chiều", () => {
      repo.create({ title: "none" });
      repo.create({ title: "late", dueDate: "2031-01-01T00:00:00.000Z" });
      repo.create({ title: "soon", dueDate: "2030-01-01T00:00:00.000Z" });
      const titles = (order: "asc" | "desc") =>
        repo.search({ ...baseQuery, sort: "dueDate", order }).items.map((t) => t.title);
      expect(titles("asc")).toEqual(["soon", "late", "none"]);
      expect(titles("desc")).toEqual(["late", "soon", "none"]);
    });

    it("phân trang và trả về tổng số", () => {
      ["A", "B", "C", "D", "E"].forEach((title) => repo.create({ title }));
      const page2 = repo.search({ ...baseQuery, page: 2, limit: 2 });
      expect(page2.total).toBe(5);
      expect(page2.items.map((t) => t.title)).toEqual(["C", "D"]);
      expect(repo.search({ ...baseQuery, page: 9, limit: 2 }).items).toEqual([]);
    });

    it("kết hợp completed với q", () => {
      const a = repo.create({ title: "Mua A" });
      repo.create({ title: "Mua B" });
      repo.update(a.id, { completed: true });
      const result = repo.search({ ...baseQuery, q: "mua", completed: true });
      expect(result.items.map((t) => t.title)).toEqual(["Mua A"]);
    });
  });

  describe("stats", () => {
    it("đếm tổng, hoàn thành, đang làm và quá hạn", () => {
      const done = repo.create({ title: "done", dueDate: "2000-01-01T00:00:00.000Z" });
      repo.update(done.id, { completed: true });
      repo.create({ title: "overdue", dueDate: "2000-01-01T00:00:00.000Z" });
      repo.create({ title: "future", dueDate: "2999-01-01T00:00:00.000Z" });
      repo.create({ title: "nodue" });
      expect(repo.stats()).toEqual({ total: 4, completed: 1, pending: 3, overdue: 1 });
    });
  });
});
