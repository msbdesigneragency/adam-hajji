import test from "node:test";
import assert from "node:assert/strict";
import { slots, defaultRules } from "../lib/data.ts";
const monday = "2026-10-26";
const appointment = (time, status = "confirmed", service = "consultation") => ({
  id: "test",
  name: "Fictional",
  phone: "",
  email: "test@example.com",
  service,
  date: monday,
  time,
  message: "",
  status,
});
test("working hours exclude lunch and never overrun closing", () => {
  const result = slots(monday, defaultRules, []);
  assert(result.includes("09:00"));
  assert(!result.includes("13:00"));
  assert(!result.includes("13:30"));
  assert.equal(result.at(-1), "17:30");
});
test("closed dates and non-working days have no slots", () => {
  assert.deepEqual(
    slots(monday, { ...defaultRules, closed: [monday] }, []),
    [],
  );
  assert.deepEqual(slots("2026-11-01", defaultRules, []), []);
});
test("pending and confirmed requests reserve their time; cancellations release it", () => {
  for (const status of ["confirmed", "pending"])
    assert(
      !slots(monday, defaultRules, [appointment("09:00", status)]).includes(
        "09:00",
      ),
    );
  assert(
    slots(monday, defaultRules, [appointment("09:00", "cancelled")]).includes(
      "09:00",
    ),
  );
});
test("overlap detection accounts for the duration of the existing appointment", () => {
  const rules = { ...defaultRules, durations: { implants: 90 } };
  const result = slots(
    monday,
    rules,
    [appointment("09:00", "confirmed", "implants")],
    "consultation",
  );
  assert(!result.includes("09:00"));
  assert(!result.includes("09:30"));
  assert(!result.includes("10:00"));
  assert(result.includes("10:30"));
});
test("long appointments cannot overlap shorter existing appointments", () => {
  const rules = { ...defaultRules, durations: { implants: 90 } };
  const result = slots(monday, rules, [appointment("10:00")], "implants");
  assert(!result.includes("09:00"));
  assert(result.includes("10:30"));
});
test("buffers preserve separation between appointments", () => {
  const rules = { ...defaultRules, buffer: 15 };
  assert(!slots(monday, rules, [appointment("09:30")]).includes("09:00"));
});
import { availableSlots, today } from "../lib/data.ts";
test("availability uses the clinic timezone and removes elapsed times", () => {
  const now = new Date("2026-10-26T13:05:00Z");
  const result = availableSlots(monday, defaultRules, [], "consultation", now);
  assert(!result.includes("14:00"));
  assert(result.includes("14:30"));
  assert.deepEqual(
    availableSlots("2026-10-25", defaultRules, [], "consultation", now),
    [],
  );
  assert.equal(today(new Date("2026-10-26T23:30:00Z")), "2026-10-27");
});
