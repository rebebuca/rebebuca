import { produce } from 'immer'
import { invoke } from '@tauri-apps/api'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type CommandItemType = {
  id: string
  url: string
  status: string
  log: string[]
  pid?: number
}

const INIT_STATE: CommandItemType[] = [
  {
    id: '0',
    log: [''],
    status: '-1',
    pid: 0,
    url: ''
  }
]

// let run12Once = false

const run12OnceMap = new Map()

export const commandListSlice = createSlice({
  name: 'todoList',
  initialState: INIT_STATE,
  reducers: {
    addCommand: produce((draft: CommandItemType[], action: PayloadAction<CommandItemType>) => {
      const { id } = action.payload
      const index = draft.findIndex(i => i.id == id)
      if (index !== -1) {
        return
      } else draft.unshift(action.payload)
    }),

    updateCommand: produce(
      (
        draft: CommandItemType[],
        action: PayloadAction<{
          id: string
          status: string
          log: string
          pid: number
          item: { url: string }
        }>
      ) => {
        const { id, status, log, pid, item } = action.payload
        const index = draft.findIndex(i => i.id === id)
        if (index !== -1) {
          draft[index].status = status
          draft[index].pid = pid
          if (draft[index].log.length > 20) {
            draft[index].log.shift()
            draft[index].log.push(log)
          } else draft[index].log.push(log)

          if (status == '1' || status == '0' || status == '11') {
            const projectDetail = {
              ...item,
              status: status,
              pid,
              log: JSON.stringify(draft[index].log)
            }
            invoke('update_project_detail', {
              projectDetail
            })
            run12OnceMap.set(id, false)
            // run12Once = false
          }

          if (status == '12' && !run12OnceMap.get(id)) {
            const projectDetail = {
              ...item,
              status: status,
              pid,
              log: JSON.stringify(draft[index].log)
            }
            invoke('update_project_detail', {
              projectDetail
            })
            run12OnceMap.set(id, true)
          }
        } else {
          draft.unshift({
            id,
            log: [log],
            status,
            pid,
            url: item.url
          })

          if (status == '1' || status == '0' || status == '11') {
            const projectDetail = {
              ...item,
              status: status,
              pid,
              log: JSON.stringify(draft[0].log)
            }
            invoke('update_project_detail', {
              projectDetail
            })
            run12Once = false
          }
          if (status == '12' && !run12OnceMap.get(id)) {
            const projectDetail = {
              ...item,
              status: status,
              pid,
              log: JSON.stringify(draft[0].log)
            }
            invoke('update_project_detail', {
              projectDetail
            })
            run12OnceMap.set(id, true)
          }
        }
      }
    ),

    resetCommandLog: produce((draft: CommandItemType[], action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload
      const index = draft.findIndex(i => i.id === id)
      if (index !== -1) {
        draft[index].log = ['']
      }
    }),

    removeCommand: produce((draft: CommandItemType[], action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload
      const index = draft.findIndex(i => i.id === id)
      draft.splice(index, 1)
    })
  }
})

export const { addCommand, removeCommand, updateCommand, resetCommandLog } =
  commandListSlice.actions

export default commandListSlice.reducer
