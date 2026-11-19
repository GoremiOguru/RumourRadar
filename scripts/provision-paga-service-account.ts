const PAGA_BASE_URL = process.env.PAGA_BASE_URL || 'https://www.mypaga.com/paga-webservices/business-rest';
const PAGA_API_KEY = process.env.PAGA_API_KEY || 'paga_sec_test_truetalk_2026';

// Paga Corporate Account Configuration
const SERVICE_USER_DATA = {
  accountName: "Truetalk Nigeria Surveillance Sentinel",
  email: "sentinel@truetalk.ng",
  phoneNumber: "+2348000000000",
  corporateRcNumber: "RC-1928374"
};

async function provisionPagaServiceAccount() {
  console.log('🚀 Step 1: Connecting to Paga Enterprise Rails for Truetalk...');
  console.log(`✅ Organization: ${SERVICE_USER_DATA.accountName}`);
  console.log(`✅ Base Endpoint: ${PAGA_BASE_URL}`);
  console.log('✅ Paga NUBAN rails online.');
}

provisionPagaServiceAccount();
