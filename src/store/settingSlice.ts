import { createSlice } from '@reduxjs/toolkit';

const settingSlice = createSlice({
  name: 'settings',
  initialState: {
    // 初始状态
    settingsData: {
      lang: 'ch',
      theme: 'light',
      ffmpeg: 'default',
      version: '1.0',
      quit_type: '1',
    },
  },
  reducers: {
    // Reducers
    setSettings: (state, action) => {
      state.settingsData = action.payload;
    },
  },
});

// 导出 actions
export const { setSettings } = settingSlice.actions;

// 导出 reducer
export default settingSlice.reducer;
