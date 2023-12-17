import { configureStore } from '@reduxjs/toolkit'
import commandListReducer, { CommandItemType } from './commandList'

export type StateType = {
  count: number
  commandList: CommandItemType[]
}

export default configureStore({
  reducer: {
    commandList: commandListReducer,
  },
})
