import { useCallback, useRef, useState } from 'react';

export function usePanZoom() {
  const [view, setView] = useState({ scale: 1, tx: 0, ty: 0 });
  const dragState = useRef<{
    startX: number;
    startY: number;
    tx: number;
    ty: number;
  } | null>(null);

  const zoomBy = useCallback((factor: number) => {
    setView((v) => ({
      ...v,
      scale: Math.min(2.5, Math.max(0.5, v.scale * factor))
    }));
  }, []);

  const resetView = useCallback(() => setView({ scale: 1, tx: 0, ty: 0 }), []);

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      tx: view.tx,
      ty: view.ty
    };
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const drag = dragState.current;
    if (!drag) return;
    setView((v) => ({
      ...v,
      tx: drag.tx + (e.clientX - drag.startX),
      ty: drag.ty + (e.clientY - drag.startY)
    }));
  };

  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
    dragState.current = null;
  };

  const onWheel = (e: React.WheelEvent<SVGSVGElement>) =>
    zoomBy(e.deltaY < 0 ? 1.08 : 0.93);

  return {
    view,
    zoomBy,
    resetView,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onWheel
  };
}
