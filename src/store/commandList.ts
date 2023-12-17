import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { invoke } from '@tauri-apps/api'
import { produce } from 'immer'

export type CommandItemType = {
  id: string
  log: string[]
  statusText: string
  pid?: number
  status: string
  url: string
}

const INIT_STATE: CommandItemType[] = [
  {
    id: '0',
    log: [''],
    statusText: '',
    status: '-1',
    pid: 0,
    url: '',
  },
]

let run12Once = false

export const todoListSlice = createSlice({
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
          item: object
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
              log: JSON.stringify(draft[index].log),
            }
            invoke('update_project_detail', {
              projectDetail,
            })
            // return 888888
          }

          if (status == '12' && !run12Once) {
            const projectDetail = {
              ...item,
              status: status,
              log: JSON.stringify(draft[index].log),
            }
            invoke('update_project_detail', {
              projectDetail,
            })
            run12Once = true
          }
        } else {
          draft.unshift({
            id,
            log: [log],
            statusText: '',
            status,
            pid,
            url: item.url,
          })

          if (status == '1' || status == '0' || status == '11') {
            const projectDetail = {
              ...item,
              status: status,
              log: JSON.stringify(draft[0].log),
            }
            invoke('update_project_detail', {
              projectDetail,
            })
          }
          if (status == '12' && !run12Once) {
            const projectDetail = {
              ...item,
              status: status,
              log: JSON.stringify(draft[0].log),
            }
            invoke('update_project_detail', {
              projectDetail,
            })
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
    }),
  },
})

export const { addCommand, removeCommand, updateCommand, resetCommandLog } = todoListSlice.actions

export default todoListSlice.reducer
