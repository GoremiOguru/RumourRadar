import { describe, it, expect } from 'vitest';
import en from '../../../locales/en.json';
import pcm from '../../../locales/pcm.json';

function getAllKeys(obj: Record<string, any>, prefix = ''): string[] {
  let keys: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      keys = keys.concat(getAllKeys(v, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys.sort();
}

describe('i18n Dictionary Parity', () => {
  it('should have exact key parity between en.json and pcm.json', () => {
    const enKeys = getAllKeys(en);
    const pcmKeys = getAllKeys(pcm);

    const missingInPcm = enKeys.filter(k => !pcmKeys.includes(k));
    const missingInEn = pcmKeys.filter(k => !enKeys.includes(k));

    if (missingInPcm.length > 0) {
      console.error('Keys in en.json missing from pcm.json:', missingInPcm);
    }
    if (missingInEn.length > 0) {
      console.error('Keys in pcm.json missing from en.json:', missingInEn);
    }

    expect(missingInPcm).toEqual([]);
    expect(missingInEn).toEqual([]);
    expect(pcmKeys.length).toBe(enKeys.length);
  });

  it('pcm.json contains native speaker review note', () => {
    expect((pcm as any)._note).toBeDefined();
    expect((pcm as any)._note).toContain('Review by a native Nigerian Pidgin speaker');
  });
});
