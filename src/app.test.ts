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
    expect(res.body).toEqual({ data: [] });
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
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.every((t: { completed: boolean }) => t.completed === false)).toBe(true);
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
});
