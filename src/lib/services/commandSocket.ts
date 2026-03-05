import { writable } from "svelte/store"
import { currentScreen } from "$lib/stores/appStore"

export const currentCommand = writable<string>("")

const socket = new WebSocket("ws://localhost:8765")

socket.onopen = () => {
  console.log("Command socket connected")
}

socket.onmessage = (event) => {
  const data = JSON.parse(event.data)

  if (data.type === "command") {
    const cmd = data.command

    console.log("Command received:", cmd)

    currentCommand.set(cmd)

    // 🔥 GLOBAL COMMAND ROUTER
    switch (cmd) {
      case "show_splash":
        currentScreen.set("splash")
        break

      case "show_prep":
        currentScreen.set("prep")
        break

      case "show_breathing":
        currentScreen.set("breathing")
        break

      case "show_complete":
        currentScreen.set("completed")
        break
    }
  }
}