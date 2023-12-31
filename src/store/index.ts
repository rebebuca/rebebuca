import { configureStore } from '@reduxjs/toolkit'

import commandListReducer, { CommandItemType } from './commandList'
import settingSlice, { SettingStateType } from './settings'

export type StateType = {
  commandList: CommandItemType[]
  settings: SettingStateType
}

export default configureStore({
  reducer: {
    commandList: commandListReducer,
    settings: settingSlice
  }
})
