import { configureStore } from '@reduxjs/toolkit'

import commandListReducer, { CommandItemType } from './commandList'
import settingSlice from './settingSlice';

export type StateType = {
  commandList: CommandItemType[]
}

export default configureStore({
  reducer: {
    commandList: commandListReducer,
    settings: settingSlice,
  }
})
