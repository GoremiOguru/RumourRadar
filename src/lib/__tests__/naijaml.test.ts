import { describe, it, expect } from 'vitest';
import { detectNigerianVernacular, restoreNigerianDiacritics, generateMultilingualExplanations } from '../naijaml';

describe('NaijaML Vernacular Language & Transliteration Engine', () => {
  it('should detect Naija Pidgin markers accurately', () => {
    const text = 'Wetin dey happen for Lagos today? Make una no panic o, na lie.';
    const result = detectNigerianVernacular(text);

    expect(result.code).toBe('pcm');
    expect(result.name).toBe('Naija Pidgin');
    expect(result.isVernacular).toBe(true);
    expect(result.confidenceScore).toBeGreaterThan(80);
  });

  it('should detect Yoruba language markers', () => {
    const text = 'Ekuo gbogbo ile, awon ti nse ariwo pe ori osun nbo.';
    const result = detectNigerianVernacular(text);

    expect(result.code).toBe('yo');
    expect(result.name).toBe('Yorùbá');
    expect(result.isVernacular).toBe(true);
  });

  it('should restore tone diacritics for Nigerian named entities', () => {
    expect(restoreNigerianDiacritics('tinubu')).toBe('Bola Ahmed Tinúbú');
    expect(restoreNigerianDiacritics('osun')).toBe('Ọ̀ṣun State');
    expect(restoreNigerianDiacritics('unknown')).toBe('unknown');
  });

  it('should generate multilingual debunk explanations in 4 Nigerian languages', () => {
    const res = generateMultilingualExplanations(
      'CONTRADICTED',
      'This claim is false and disputed by official regulators.'
    );

    expect(res.english).toBeDefined();
    expect(res.pidgin).toContain('fake talk');
    expect(res.yoruba).toContain('ìròyìn èke');
    expect(res.hausa).toContain('labarin bashi');
    expect(res.igbo).toContain('okwu asị');
  });
});
