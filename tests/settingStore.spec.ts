import { expect, test } from '@playwright/test';
import { useSettingStore } from '../app/stores/settingStore';

test('resetScene clears scrolling and typing from previous scene mount', () => {
  const initial = useSettingStore.getState();
  try {
    initial.setIsScrolling(true);
    initial.setIsTypingRunning(true);
    initial.enterBasicMode('interrupted scene');
    initial.resetScene();
    expect(useSettingStore.getState()).toMatchObject({
      mode: 'animated',
      isTypingRunning: false,
      isScrolling: false,
    });
  } finally {
    useSettingStore.setState(initial, true);
  }
});
