// MediaPipe Hand Landmark Drawing Utilities for Canvas

export const HAND_CONNECTIONS = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [9, 10], [10, 11], [11, 12],
  // Ring
  [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm Base
  [5, 9], [9, 13], [13, 17]
];

export const FINGERTIPS = [4, 8, 12, 16, 20];

/**
 * Draws real-time MediaPipe hand skeletons on a transparent canvas overlay
 */
export function drawHandLandmarks(ctx, handsLandmarks, canvasWidth, canvasHeight, isMirrored = true) {
  if (!ctx || !handsLandmarks || handsLandmarks.length === 0) return;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  handsLandmarks.forEach((landmarks, handIndex) => {
    if (!landmarks || landmarks.length !== 21) return;

    // Convert normalized coordinates [0.0, 1.0] to canvas pixel space
    const points = landmarks.map(lm => {
      const x = lm.x * canvasWidth;
      const y = lm.y * canvasHeight;
      return { x, y, z: lm.z };
    });

    // 1. Draw Skeletal Connections (Bones)
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    HAND_CONNECTIONS.forEach(([startIdx, endIdx]) => {
      const p1 = points[startIdx];
      const p2 = points[endIdx];

      if (!p1 || !p2) return;

      // Glow effect
      ctx.shadowColor = handIndex === 0 ? 'rgba(34, 211, 238, 0.8)' : 'rgba(52, 211, 153, 0.8)';
      ctx.shadowBlur = 10;
      ctx.strokeStyle = handIndex === 0 ? '#06B6D4' : '#10B981';

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    });

    // 2. Draw Landmark Joints
    points.forEach((p, idx) => {
      const isTip = FINGERTIPS.includes(idx);
      const isWrist = idx === 0;

      ctx.shadowBlur = isTip ? 14 : 6;
      ctx.shadowColor = isTip ? '#22D3EE' : '#FFFFFF';

      ctx.beginPath();
      const radius = isTip ? 5.5 : isWrist ? 6 : 4;
      ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);

      if (isTip) {
        ctx.fillStyle = '#22D3EE';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.8;
        ctx.stroke();
      } else if (isWrist) {
        ctx.fillStyle = '#F59E0B';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.strokeStyle = '#0891B2';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    });
  });

  // Reset shadow for next frame
  ctx.shadowBlur = 0;
}
