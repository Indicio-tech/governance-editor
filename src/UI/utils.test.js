import { getNextId } from "./utils"

describe("getNextId", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {})
  })
  afterEach(() => {
    console.log.mockRestore()
  })

  test("returns 1 for an empty array", () => {
    expect(getNextId([], "id")).toBe(1)
  })

  test("returns max + 1", () => {
    expect(getNextId([{ id: 1 }, { id: 5 }, { id: 3 }], "id")).toBe(6)
  })

  test("uses the supplied key", () => {
    expect(getNextId([{ participant_id: 2 }], "participant_id")).toBe(3)
  })

  test("does not reuse ids after a gap", () => {
    expect(getNextId([{ id: 1 }, { id: 4 }], "id")).toBe(5)
  })
})
