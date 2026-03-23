# NostraHealthAI TypeScript/Node.js SDK

Official TypeScript/JavaScript SDK for **NostraHealthAI-1.0** - Advanced Medical AI Assistant.

## Installation

```bash
npm install @nostrahealthai/sdk
# or
yarn add @nostrahealthai/sdk
```

## Quick Start

```typescript
import { NostraHealthAI } from '@nostrahealthai/sdk';

// Initialize client
const client = new NostraHealthAI({
  apiKey: 'your-firebase-token'
});

// Chat with the AI
const response = await client.chat({
  message: 'What are the symptoms of high blood pressure?'
});

console.log(response.response);
console.log(`Model: ${response.modelInfo?.name}`);

// Analyze medical file
const jobId = await client.analyzeFile('./lab-results.png');
const result = await client.waitForJobCompletion(jobId);

console.log(`Risk Level: ${result.data.riskLevel}`);
console.log(`Summary: ${result.data.summary}`);
```

## Features

- 🩺 **Medical Chat** - Conversational AI with context memory
- 📊 **File Analysis** - Analyze lab reports, X-rays, medical images
- 🤖 **Multi-Model AI** - Powered by OpenAI GPT-4o + Google Gemini
- 📚 **Evidence-Based** - Cites medical sources (RxNorm, OpenFDA, PubMed)
- ⚡ **Promise-Based** - Modern async/await API
- 📝 **TypeScript** - Full type definitions included

## Documentation

Full documentation available at: [SDK Documentation](../README.md)

## Examples

See [typescript-example.ts](../examples/typescript-example.ts) for comprehensive examples.

## Requirements

- Node.js 16+ or Browser
- axios >= 1.6.0

## License

MIT License
