import reducer, {
  setNotificationState,
  clearNotificationsState,
} from "./notificationsReducer"

describe("notificationsReducer", () => {
  const initial = reducer(undefined, { type: "@@INIT" })

  test("starts with an empty notification", () => {
    expect(initial).toEqual({ notificationMessage: "", notificationType: "" })
  })

  test("setNotificationState stores message and type", () => {
    const next = reducer(
      initial,
      setNotificationState({ message: "Saved", type: "notice" })
    )
    expect(next).toEqual({
      notificationMessage: "Saved",
      notificationType: "notice",
    })
  })

  test("a newer notification replaces the older one", () => {
    let state = reducer(initial, setNotificationState({ message: "a", type: "notice" }))
    state = reducer(state, setNotificationState({ message: "b", type: "error" }))
    expect(state).toEqual({ notificationMessage: "b", notificationType: "error" })
  })

  test("clearNotificationsState resets to initial", () => {
    const state = reducer(initial, setNotificationState({ message: "x", type: "error" }))
    expect(reducer(state, clearNotificationsState())).toEqual(initial)
  })

  test("ignores unknown actions", () => {
    expect(reducer(initial, { type: "UNKNOWN" })).toBe(initial)
  })
})
