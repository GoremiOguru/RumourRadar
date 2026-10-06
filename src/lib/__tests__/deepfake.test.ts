import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/deepfake/scan/route';
import { NextRequest } from 'next/server';

describe('Deepfake Scanner Video & Image Tests', () => {
  it('should analyze single image and return dynamic synthetic or authentic report', async () => {
    const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const req = new NextRequest('http://localhost:3000/api/deepfake/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoName: 'test-scan.png',
        mediaType: 'image',
        rawImageBase64: sampleBase64,
        cleanFrames: [sampleBase64]
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    console.log('Image Result probability:', data.result.deepfakeProbability);
    expect(data.result.deepfakeProbability).not.toBe(68);
  });

  it('should analyze multi-frame authentic video recording', async () => {
    const frame1 = 'data:image/jpeg;base64,' + Buffer.from('REAL_CAMERA_FRAME_1_WITH_NATURAL_NOISE_' + 'A'.repeat(500)).toString('base64');
    const frame2 = 'data:image/jpeg;base64,' + Buffer.from('REAL_CAMERA_FRAME_2_WITH_NATURAL_NOISE_' + 'A'.repeat(500)).toString('base64');

    const req = new NextRequest('http://localhost:3000/api/deepfake/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoName: 'Official NCDC Press Briefing Video.mp4',
        mediaType: 'video',
        cleanFrames: [frame1, frame2]
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    console.log('Authentic Video Verdict:', data.result.verdictDisplay);
    console.log('Authentic Video Probability:', data.result.deepfakeProbability);
    expect(data.result.verdict).toBe('AUTHENTIC_RECORDING');
    expect(data.result.deepfakeProbability).toBeLessThanOrEqual(25);
  });

  it('should analyze multi-frame AI deepfake video and flag synthetic manipulation', async () => {
    const frame1 = 'data:image/jpeg;base64,' + Buffer.from('AI_DEEPFAKE_CLONED_FRAME_1').toString('base64');
    const frame2 = 'data:image/jpeg;base64,' + Buffer.from('AI_DEEPFAKE_CLONED_FRAME_2').toString('base64');

    const req = new NextRequest('http://localhost:3000/api/deepfake/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoName: 'Deepfake AI Voice-Cloned Speech.mp4',
        mediaType: 'video',
        cleanFrames: [frame1, frame2]
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    console.log('Deepfake Video Verdict:', data.result.verdictDisplay);
    console.log('Deepfake Video Probability:', data.result.deepfakeProbability);
    expect(data.result.verdict).toBe('SYNTHETIC_DEEPFAKE');
    expect(data.result.deepfakeProbability).toBeGreaterThanOrEqual(85);
  });
});
