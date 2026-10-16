import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";

const app = createApp();

describe("Todo API", () => {
  it("GET /health trả về ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("GET /todos trả về danh sách rỗng ban đầu", async () => {
    const res = await request(app).get("/todos");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: { items: [], total: 0, page: 1, limit: 10 },
      error: null,
    });
  });

  it("POST /todos tạo mới và trả về 201", async () => {
    const res = await request(app).post("/todos").send({ title: "Viết test" });
    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({ title: "Viết test", completed: false });
    expect(res.body.data.id).toBeTruthy();
  });

  it("POST /todos trả về 400 khi thiếu title", async () => {
    const res = await request(app).post("/todos").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  it("GET /todos?completed=false lọc theo trạng thái", async () => {
    const res = await request(app).get("/todos?completed=false");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.items)).toBe(true);
    expect(res.body.data.items.every((t: { completed: boolean }) => t.completed === false)).toBe(true);
  });

  it("GET /todos?completed=xyz trả về 400 khi giá trị không hợp lệ", async () => {
    const res = await request(app).get("/todos?completed=xyz");
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  it("vòng đời đầy đủ: tạo → cập nhật → xóa", async () => {
    const created = await request(app).post("/todos").send({ title: "Task" });
    const id = created.body.data.id as string;

    const updated = await request(app).patch(`/todos/${id}`).send({ completed: true });
    expect(updated.status).toBe(200);
    expect(updated.body.data.completed).toBe(true);

    const removed = await request(app).delete(`/todos/${id}`);
    expect(removed.status).toBe(204);

    const missing = await request(app).get(`/todos/${id}`);
    expect(missing.status).toBe(404);
  });
  it("lỗi 400 dùng định dạng thống nhất", async () => {
    const res = await request(app).post("/todos").send({});
    expect(res.body).toMatchObject({ success: false, data: null });
    expect(typeof res.body.error).toBe("string");
  });

  it("POST /todos trả về 400 khi body không phải JSON hợp lệ", async () => {
    const res = await request(app).post("/todos").set("Content-Type", "application/json").send("{bad");
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("POST /todos nhận priority và dueDate", async () => {
    const res = await request(app)
      .post("/todos")
      .send({ title: "Có hạn", priority: "high", dueDate: "2030-01-01T00:00:00.000Z" });
    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({ priority: "high", dueDate: "2030-01-01T00:00:00.000Z" });
  });

  it("POST /todos trả về 400 khi priority không hợp lệ", async () => {
    const res = await request(app).post("/todos").send({ title: "A", priority: "urgent" });
    expect(res.status).toBe(400);
  });

  it("PATCH /todos/:id trả về 400 khi completed không phải boolean", async () => {
    const created = await request(app).post("/todos").send({ title: "A" });
    const res = await request(app).patch(`/todos/${created.body.data.id}`).send({ completed: "yes" });
    expect(res.status).toBe(400);
  });

  it("PATCH /todos/:id trả về 404 khi id không tồn tại", async () => {
    const res = await request(app).patch("/todos/khong-ton-tai").send({ completed: true });
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("DELETE /todos/:id trả về 404 khi id không tồn tại", async () => {
    const res = await request(app).delete("/todos/khong-ton-tai");
    expect(res.status).toBe(404);
  });

  it("GET /todos hỗ trợ q, sort và phân trang", async () => {
    const isolated = createApp();
    for (const title of ["Mua cam", "Mua táo", "Đọc sách"]) {
      await request(isolated).post("/todos").send({ title });
    }
    const res = await request(isolated).get("/todos?q=mua&sort=createdAt&order=asc&page=2&limit=1");
    expect(res.status).toBe(200);
    expect(res.body.data.total).toBe(2);
    expect(res.body.data.items.map((t: { title: string }) => t.title)).toEqual(["Mua táo"]);
  });

  it.each(["limit=0", "limit=51", "page=0", "sort=title", "order=up"])(
    "GET /todos?%s trả về 400",
    async (qs) => {
      const res = await request(app).get(`/todos?${qs}`);
      expect(res.status).toBe(400);
    },
  );

  it("GET /todos/stats trả về thống kê và không bị nhầm với :id", async () => {
    const isolated = createApp();
    const a = await request(isolated).post("/todos").send({ title: "A", dueDate: "2000-01-01T00:00:00.000Z" });
    await request(isolated).post("/todos").send({ title: "B" });
    await request(isolated).patch(`/todos/${a.body.data.id}`).send({ completed: true });

    const res = await request(isolated).get("/todos/stats");
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ total: 2, completed: 1, pending: 1, overdue: 0 });
  });

  it("route không tồn tại trả về 404 theo định dạng thống nhất", async () => {
    const res = await request(app).get("/khong-co");
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ success: false, data: null });
  });
});
