import { describe, it, expect } from 'vitest';
import zonesData from '../nigeria-zones-data.json';
import { createPagaVirtualAccount, checkPaymentRedFlag } from '../paga';

describe('Truetalk Realistic Nigeria Geopolitical Zones', () => {
  it('should load all 6 Nigerian Geopolitical Zones from vector data', () => {
    const zones = Object.keys(zonesData.zones);
    expect(zones).toContain('North West');
    expect(zones).toContain('North East');
    expect(zones).toContain('North Central');
    expect(zones).toContain('South West');
    expect(zones).toContain('South East');
    expect(zones).toContain('South South');
  });

  it('should have realistic boundary lines for all 36 states and FCT', () => {
    expect(zonesData.boundaries.length).toBeGreaterThanOrEqual(90);
    expect(zonesData.viewBox).toBe('0 0 954 734');
  });

  it('should verify Paga NUBAN fraud protection on Nigerian scam accounts', async () => {
    const scamQuery = 'Pay ₦5000 fee to GTBank 0581928374 for CBN palliative';
    const check = await checkPaymentRedFlag(scamQuery);
    expect(check).toBeDefined();
    expect(check?.status).toBe('ACCOUNT_VERIFIED_MISMATCH');
    expect(check?.riskScore).toBeGreaterThan(90);
  });
});
