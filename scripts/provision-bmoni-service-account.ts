const BMONI_BASE_URL = process.env.BMONI_BASE_URL || 'https://embedded-dev.bmoni.com';
const BMONI_API_KEY = process.env.BMONI_API_KEY || 'pk_a025cacbf33a_76fb864113f3540909dc5b1da39cc146906e35b1c6d4d1e4';

// Sandbox Persona: Bunch Dillon (Must match exact BMONI sandbox test data)
const SERVICE_USER_DATA = {
  firstName: "Bunch",
  lastName: "Dillon",
  email: "service-account@rumourradar.app",
  phoneNumber: "+2348000000000",
  bvn: "95888168924"
};

async function provisionServiceAccount() {
  console.log('🚀 Step 1: Registering BMONI Service Account User...');

  const createRes = await fetch(`${BMONI_BASE_URL}/v1/users`, {
    method: 'POST',
    headers: {
      'x-api-key': BMONI_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(SERVICE_USER_DATA)
  });

  const createData: any = await createRes.json();

  if (!createRes.ok) {
    console.error('❌ User creation failed:', createData);
    return;
  }

  const userId = createData.id || createData.userId || createData.bmoniUserId;
  console.log(`✅ BMONI User Created! User ID: ${userId}`);

  console.log('\n🚀 Step 2: Updating KYC details for sandbox persona...');
  const kycRes = await fetch(`${BMONI_BASE_URL}/v1/users/${userId}/kyc`, {
    method: 'PATCH',
    headers: {
      'x-api-key': BMONI_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      bvn: SERVICE_USER_DATA.bvn,
      dateOfBirth: "1990-01-01"
    })
  });

  if (kycRes.ok) {
    console.log('✅ KYC tier updated successfully.');
  } else {
    console.warn('⚠️ KYC update warning:', await kycRes.text());
  }

  console.log('\n🚀 Step 3: Initiating Nigeria Onboarding...');
  const onboardingRes = await fetch(`${BMONI_BASE_URL}/v1/users/${userId}/onboarding/start-nigeria`, {
    method: 'POST',
    headers: {
      'x-api-key': BMONI_API_KEY,
      'Content-Type': 'application/json'
    }
  });

  const onboardingData: any = await onboardingRes.json();

  if (onboardingRes.ok) {
    console.log('🎉 Onboarding Complete!');
    console.log('--------------------------------------------------');
    console.log(`ADD THIS TO YOUR .env.local FILE:`);
    console.log(`BMONI_SERVICE_USER_ID=${userId}`);
    console.log('--------------------------------------------------');
  } else {
    console.error('❌ Onboarding failed:', onboardingData);
  }
}

provisionServiceAccount().catch(console.error);
