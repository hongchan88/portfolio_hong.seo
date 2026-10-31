'use client';
import { Component, ReactNode, useEffect } from 'react';
import { useSettingStore } from '../app/stores/settingStore';

export function SceneUnavailable() {
  useEffect(() => {
    useSettingStore.getState().enterBasicMode('Scene unavailable');
  }, []);
  return null;
}

export default class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <SceneUnavailable /> : this.props.children;
  }
}
