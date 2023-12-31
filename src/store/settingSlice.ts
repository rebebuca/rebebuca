import { createSlice } from '@reduxjs/toolkit'

export type SettingType = {
  lang: string
  theme: string
  ffmpeg: string
  version: string
  quit_type: string
}

export type SettingStateType = {
  settingsData: SettingType
}

const INIT_STATE: SettingStateType = {
  settingsData: {
    lang: 'ch',
    theme: 'light',
    ffmpeg: 'default',
    version: '1.0',
    quit_type: '1'
  }
}

const settingSlice = createSlice({
  name: 'settings',
  initialState: INIT_STATE,
  reducers: {
    // Reducers
    setSettings: (state, action) => {
      state.settingsData = action.payload
    }
  }
})

// 导出 actions
export const { setSettings } = settingSlice.actions

// 导出 reducer
export default settingSlice.reducer
