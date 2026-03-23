/**
 * Unit tests for NostraHealthAI TypeScript SDK.
 * Tests SDK construction, module initialization, and type exports.
 *
 * Run with: npx ts-node src/index.test.ts
 */

import NostraHealthAI from './index';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.log(`  ✗ ${message}`);
    failed++;
  }
}

function describe(name: string, fn: () => void) {
  console.log(`\n${name}`);
  fn();
}

// ============================================================================
// TESTS
// ============================================================================

describe('Client Initialization', () => {
  assert(
    (() => {
      const client = new NostraHealthAI({ apiKey: 'test-key' });
      return client !== null && client !== undefined;
    })(),
    'Creates client with valid API key'
  );

  assert(
    (() => {
      const client = new NostraHealthAI({ apiKey: 'test-key', baseURL: 'https://custom.api.com' });
      return client !== null;
    })(),
    'Creates client with custom base URL'
  );

  assert(
    (() => {
      const client = new NostraHealthAI({ apiKey: 'test-key', timeout: 30000 });
      return client !== null;
    })(),
    'Creates client with custom timeout'
  );
});

describe('Module Initialization', () => {
  const client = new NostraHealthAI({ apiKey: 'test-key' });

  assert(client.skin !== undefined && client.skin !== null, 'Skin module is initialized');
  assert(client.eye !== undefined && client.eye !== null, 'Eye module is initialized');
  assert(client.wound !== undefined && client.wound !== null, 'Wound module is initialized');
  assert(client.drug !== undefined && client.drug !== null, 'Drug module is initialized');
  assert(client.fhir !== undefined && client.fhir !== null, 'FHIR module is initialized');
  assert(client.subscriptions !== undefined && client.subscriptions !== null, 'Subscription module is initialized');
});

describe('Module Methods Exist', () => {
  const client = new NostraHealthAI({ apiKey: 'test-key' });

  // Skin module
  assert(typeof client.skin.analyze === 'function', 'skin.analyze is a function');
  assert(typeof client.skin.waitForCompletion === 'function', 'skin.waitForCompletion is a function');
  assert(typeof client.skin.getAllAnalyses === 'function', 'skin.getAllAnalyses is a function');
  assert(typeof client.skin.getAnalysis === 'function', 'skin.getAnalysis is a function');
  assert(typeof client.skin.deleteAnalysis === 'function', 'skin.deleteAnalysis is a function');
  assert(typeof client.skin.getSupportedConditions === 'function', 'skin.getSupportedConditions is a function');

  // Eye module
  assert(typeof client.eye.analyze === 'function', 'eye.analyze is a function');
  assert(typeof client.eye.waitForCompletion === 'function', 'eye.waitForCompletion is a function');
  assert(typeof client.eye.getSupportedConditions === 'function', 'eye.getSupportedConditions is a function');

  // Wound module
  assert(typeof client.wound.analyze === 'function', 'wound.analyze is a function');
  assert(typeof client.wound.createProfile === 'function', 'wound.createProfile is a function');
  assert(typeof client.wound.getTimeline === 'function', 'wound.getTimeline is a function');
  assert(typeof client.wound.getReferenceData === 'function', 'wound.getReferenceData is a function');

  // Drug module
  assert(typeof client.drug.verify === 'function', 'drug.verify is a function');
  assert(typeof client.drug.batchVerify === 'function', 'drug.batchVerify is a function');
  assert(typeof client.drug.getStats === 'function', 'drug.getStats is a function');

  // FHIR module
  assert(typeof client.fhir.getPatientSummary === 'function', 'fhir.getPatientSummary is a function');
  assert(typeof client.fhir.getObservations === 'function', 'fhir.getObservations is a function');
  assert(typeof client.fhir.getConditions === 'function', 'fhir.getConditions is a function');
  assert(typeof client.fhir.exportBundle === 'function', 'fhir.exportBundle is a function');

  // Subscription module
  assert(typeof client.subscriptions.getPlans === 'function', 'subscriptions.getPlans is a function');
  assert(typeof client.subscriptions.getPlanDetails === 'function', 'subscriptions.getPlanDetails is a function');
  assert(typeof client.subscriptions.getMySubscription === 'function', 'subscriptions.getMySubscription is a function');
  assert(typeof client.subscriptions.purchase === 'function', 'subscriptions.purchase is a function');
  assert(typeof client.subscriptions.change === 'function', 'subscriptions.change is a function');
  assert(typeof client.subscriptions.cancel === 'function', 'subscriptions.cancel is a function');
  assert(typeof client.subscriptions.getAiUsage === 'function', 'subscriptions.getAiUsage is a function');
});

describe('Top-level Methods', () => {
  const client = new NostraHealthAI({ apiKey: 'test-key' });

  assert(typeof client.chat === 'function', 'chat is a function');
  assert(typeof client.audioChat === 'function', 'audioChat is a function');
  assert(typeof client.getConversations === 'function', 'getConversations is a function');
  assert(typeof client.getConversationMessages === 'function', 'getConversationMessages is a function');
  assert(typeof client.analyzeFile === 'function', 'analyzeFile is a function');
  assert(typeof client.getJobStatus === 'function', 'getJobStatus is a function');
  assert(typeof client.waitForJobCompletion === 'function', 'waitForJobCompletion is a function');
});

// ============================================================================
// SUMMARY
// ============================================================================

console.log(`\n${'='.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('All tests passed!');
}
