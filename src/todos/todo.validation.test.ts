import { describe, it, expect } from "vitest";
import { ValidationError, parseCreateInput, parseQuery, parseUpdateInput } from "./todo.validation.js";

describe("parseQuery", () => {
  it("dùng giá trị mặc định khi không có query", () => {
    expect(parseQuery({})).toEqual({ sort: "createdAt", order: "desc", page: 1, limit: 10 });
  });

  it("parse đầy đủ các tham số hợp lệ", () => {
    expect(
      parseQuery({ q: " mua ", completed: "false", sort: "priority", order: "asc", page: "2", limit: "50" }),
    ).toEqual({ q: "mua", completed: false, sort: "priority", order: "asc", page: 2, limit: 50 });
  });

  it("bỏ qua q rỗng", () => {
    expect(parseQuery({ q: "  " }).q).toBeUndefined();
  });

  it.each([
    [{ completed: "xyz" }],
    [{ sort: "title" }],
    [{ order: "up" }],
    [{ page: "0" }],
    [{ page: "1.5" }],
    [{ limit: "0" }],
    [{ limit: "51" }],
    [{ limit: "abc" }],
    [{ q: ["a", "b"] }],
  ])("ném ValidationError với query %j", (query) => {
    expect(() => parseQuery(query)).toThrow(ValidationError);
  });
});

describe("parseCreateInput", () => {
  it("chấp nhận title và trim", () => {
    expect(parseCreateInput({ title: "  A " })).toEqual({ title: "A" });
  });

  it("chấp nhận priority và dueDate", () => {
    expect(parseCreateInput({ title: "A", priority: "high", dueDate: "2030-01-01T00:00:00.000Z" })).toEqual({
      title: "A",
      priority: "high",
      dueDate: "2030-01-01T00:00:00.000Z",
    });
  });

  it.each([
    [undefined],
    [{}],
    [{ title: "  " }],
    [{ title: "A", priority: "urgent" }],
    [{ title: "A", dueDate: "không-phải-ngày" }],
    [{ title: "A", dueDate: 123 }],
  ])("ném ValidationError với body %j", (body) => {
    expect(() => parseCreateInput(body)).toThrow(ValidationError);
  });
});

describe("parseUpdateInput", () => {
  it("cho phép body rỗng", () => {
    expect(parseUpdateInput(undefined)).toEqual({});
  });

  it("cho phép đặt dueDate = null", () => {
    expect(parseUpdateInput({ dueDate: null })).toEqual({ dueDate: null });
  });

  it.each([
    [{ title: "" }],
    [{ completed: "yes" }],
    [{ priority: "x" }],
    [{ dueDate: "2030-13-45" }],
  ])("ném ValidationError với body %j", (body) => {
    expect(() => parseUpdateInput(body)).toThrow(ValidationError);
  });
});
