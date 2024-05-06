/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { ipcRenderer, contextBridge } from 'electron'

interface ExposedAPI {
  ipcRenderer: typeof ipcRenderer
}

export type BridgeWindow = Window & ExposedAPI

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on (...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => { listener(event, ...args) })
  },
  off (...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send (...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    ipcRenderer.send(channel, ...omit)
  },
  async invoke (...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return await ipcRenderer.invoke(channel, ...omit)
  }

  // You can expose other APTs you need here.
  // ...
})
