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
  }, 15000);

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

  describe('Cognitive First-Principles & Real-Time Truth Intelligence', () => {
    it('should detect physical impossibility: Cat on the moon without spacesuit', async () => {
      const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
      const req = new NextRequest('http://localhost:3000/api/deepfake/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoName: 'Cat walking on the moon without spacesuit',
          mediaType: 'image',
          rawImageBase64: sampleBase64
        })
      });

      const res = await POST(req);
      const data = await res.json();
      console.log('Cat on moon verdict:', data.result.verdict, data.result.forensicSummary);
      expect(data.result.verdict).toBe('SYNTHETIC_DEEPFAKE');
      expect(data.result.deepfakeProbability).toBeGreaterThanOrEqual(90);
    });

    it('should detect anatomical defect: Waitress with human feet instead of hands', async () => {
      const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
      const req = new NextRequest('http://localhost:3000/api/deepfake/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoName: 'Waitress with human feet instead of hands serving coffee on tray',
          mediaType: 'image',
          rawImageBase64: sampleBase64
        })
      });

      const res = await POST(req);
      const data = await res.json();
      console.log('Feet for hands verdict:', data.result.verdict, data.result.forensicSummary);
      expect(data.result.verdict).toBe('SYNTHETIC_DEEPFAKE');
      expect(data.result.deepfakeProbability).toBeGreaterThanOrEqual(90);
    });

    it('should detect biological & aerodynamic impossibility: 2 year old flying on giant eagle', async () => {
      const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
      const req = new NextRequest('http://localhost:3000/api/deepfake/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoName: '2 year old child riding a giant eagle in African village like a pet dragon',
          mediaType: 'image',
          rawImageBase64: sampleBase64
        })
      });

      const res = await POST(req);
      const data = await res.json();
      console.log('Eagle toddler verdict:', data.result.verdict, data.result.forensicSummary);
      expect(data.result.verdict).toBe('SYNTHETIC_DEEPFAKE');
      expect(data.result.deepfakeProbability).toBeGreaterThanOrEqual(90);
    });

    it('should detect animal biomechanical impossibility: Dog dancing salsa on a skyscraper', async () => {
      const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
      const req = new NextRequest('http://localhost:3000/api/deepfake/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoName: 'Golden retriever dog dancing salsa on a skyscraper rooftop',
          mediaType: 'video',
          cleanFrames: [sampleBase64, sampleBase64]
        })
      });

      const res = await POST(req);
      const data = await res.json();
      console.log('Dog dancing skyscraper verdict:', data.result.verdict, data.result.forensicSummary);
      expect(data.result.verdict).toBe('SYNTHETIC_DEEPFAKE');
      expect(data.result.deepfakeProbability).toBeGreaterThanOrEqual(90);
    });

    it('should detect neonatal biological impossibility: Newborn baby standing up and running', async () => {
      const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
      const req = new NextRequest('http://localhost:3000/api/deepfake/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoName: 'Newborn baby standing up and running',
          mediaType: 'image',
          rawImageBase64: sampleBase64
        })
      });

      const res = await POST(req);
      const data = await res.json();
      console.log('Newborn running verdict:', data.result.verdict, data.result.forensicSummary);
      expect(data.result.verdict).toBe('SYNTHETIC_DEEPFAKE');
      expect(data.result.deepfakeProbability).toBeGreaterThanOrEqual(90);
    });

    it('should ground and debunk political / celebrity claim via live search: Tinubu visiting Anthony Joshua in hospital', async () => {
      const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
      const req = new NextRequest('http://localhost:3000/api/deepfake/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoName: 'Tinubu visiting Anthony Joshua in hospital',
          mediaType: 'image',
          rawImageBase64: sampleBase64
        })
      });

      const res = await POST(req);
      const data = await res.json();
      console.log('Tinubu Joshua hospital verdict:', data.result.verdict, data.result.forensicSummary);
      expect(data.result.verdict).toBe('SYNTHETIC_DEEPFAKE');
      expect(data.result.deepfakeProbability).toBeGreaterThanOrEqual(90);
    });

    it('should correctly classify human comedy skits as authentic entertainment', async () => {
      const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
      const req = new NextRequest('http://localhost:3000/api/deepfake/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoName: 'Funny TikTok comedy skit - Waiter dropping coffee meme prank',
          mediaType: 'video',
          cleanFrames: [sampleBase64, sampleBase64]
        })
      });

      const res = await POST(req);
      const data = await res.json();
      console.log('TikTok skit verdict:', data.result.verdictDisplay, data.result.deepfakeProbability);
      expect(data.result.verdict).toBe('AUTHENTIC_RECORDING');
      expect(data.result.deepfakeProbability).toBeLessThanOrEqual(25);
    });

    it('should correctly classify real everyday photos and Vanguard news media without false positives', async () => {
      const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
      const req = new NextRequest('http://localhost:3000/api/deepfake/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoName: 'Vanguard News special report on agriculture economy',
          mediaType: 'video',
          cleanFrames: [sampleBase64, sampleBase64]
        })
      });

      const res = await POST(req);
      const data = await res.json();
      console.log('Vanguard report verdict:', data.result.verdictDisplay, data.result.deepfakeProbability);
      expect(data.result.verdict).toBe('AUTHENTIC_RECORDING');
      expect(data.result.deepfakeProbability).toBeLessThanOrEqual(25);
    }, 15000);
  });
});
