import { configureStore } from '@reduxjs/toolkit'

import commandListReducer, { CommandItemType } from './commandList'

export type StateType = {
  commandList: CommandItemType[]
}

export default configureStore({
  reducer: {
    commandList: commandListReducer
  }
})
