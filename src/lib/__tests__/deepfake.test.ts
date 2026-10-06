import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/deepfake/scan/route';
import { NextRequest } from 'next/server';

describe('Deepfake Scanner API with Algorithmic Forensics', () => {
  it('should analyze image dynamically without flat 68%', async () => {
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
    console.log('Result probability:', data.result.deepfakeProbability);
    console.log('Verdict:', data.result.verdictDisplay);
    console.log('Summary:', data.result.forensicSummary);
    expect(data.result.deepfakeProbability).not.toBe(68);
  });
});
