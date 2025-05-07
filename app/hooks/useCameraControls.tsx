import { useControls } from 'leva';
import { useEffect } from 'react';
import { useCameraStore } from '../stores/cameraStore';
export const useCameraControls = () => {
  const { setZoom, setCamPos, setCamRotatePos } = useCameraStore();

  const {
    cx,
    cy,
    cz,
    zoom: czoom,
    rx,
    rz,
    ry,
  } = useControls('Camera Position', {
    cx: { value: 10, step: 1 },
    cy: { value: 5, step: 1 },
    cz: { value: 14, step: 1 },
    zoom: { value: 70, min: 10, max: 100, step: 1 },
    rx: { value: 0, step: 0.01 },
    ry: { value: 0, step: 0.01 }, // default 20%
    rz: { value: 0, step: 0.01 },
  });

  // ✅ Only update store when values change
  useEffect(() => {
    setCamPos([cx, cy, cz]);
  }, [cx, cy, cz]);
  // useEffect(() => {
  //   setCamRotatePos([rx, ry, rz]);
  // }, [rx, ry, rz]);

  useEffect(() => {
    setZoom(czoom);
  }, [czoom]);
};
