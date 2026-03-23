import axios, { AxiosInstance, AxiosError } from 'axios';

// =============================================================================
// CONFIGURATION & ERROR TYPES
// =============================================================================

/**
 * NostraHealthAI SDK Configuration
 */
export interface NostraHealthAIConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
  /**
   * When set, SDK routes through organization-scoped endpoints
   * (e.g. /organizations/:orgId/ai/...) so usage is tracked per organization.
   */
  organizationId?: string;
  /**
   * When set alongside organizationId, SDK routes through org-user-scoped endpoints
   * (e.g. /organizations/:orgId/users/:userId/ai/...) so usage is tracked
   * per org user within the organization.
   */
  userId?: string;
}

/**
 * API Error
 */
export class NostraHealthAIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'NostraHealthAIError';
  }
}

// =============================================================================
// COMMON TYPES
// =============================================================================

/**
 * Model information returned by the API
 */
export interface ModelInfo {
  name: string;
  version: string;
  provider?: string;
  modelsUsed?: string[];
  aggregatedConfidence?: number;
}

/**
 * Rate limit information
 */
export interface RateLimitInfo {
  remainingRequests: number;
  resetTime: string;
  retryAfter?: number;
}

/**
 * Job status for async operations
 */
export interface JobStatus<T = any> {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  metadata: {
    createdAt: Date;
    startedAt?: Date;
    completedAt?: Date;
  };
  data?: T;
  error?: string;
}

/**
 * Potential medical condition
 */
export interface PotentialCondition {
  name: string;
  probability: 'high' | 'medium' | 'low';
  supportingEvidence: string[];
  icd10Code?: string;
  requiresImmediate?: boolean;
}

/**
 * Medical recommendation
 */
export interface Recommendation {
  type: string;
  description: string;
  urgency: 'immediate' | 'high' | 'medium' | 'low';
  reasoning?: string;
}

// =============================================================================
// CHAT TYPES
// =============================================================================

export interface ChatMessage {
  id: string;
  conversationId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  conversationId: string;
  message: ChatMessage;
  response: string;
  modelInfo?: ModelInfo;
}

export interface Conversation {
  id: string;
  userId: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}

// =============================================================================
// MEDICAL ANALYSIS TYPES
// =============================================================================

export interface LabInterpretation {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'borderline' | 'abnormal' | 'critical';
  interpretation: string;
  clinicalSignificance: string;
}

export interface DetailedSummary {
  clinical: string;
  findings: string[];
  abnormalities: string[];
  criticalValues: string[];
  trends?: string[];
}

export interface Analysis {
  id: string;
  subjectId: string;
  userId: string;
  summary: string;
  detailedSummary: DetailedSummary;
  potentialConditions: PotentialCondition[];
  laboratoryInterpretation: LabInterpretation[];
  recommendations: Recommendation[];
  riskLevel: 'low' | 'medium' | 'high';
  riskFactors: string[];
  confidence: number;
  disclaimer: string;
  dataSources: any[];
  modelMetadata: {
    modelsUsed: string[];
    modelsFailed: string[];
    aggregatedConfidence: number;
    individualConfidences: Record<string, number>;
  };
  createdAt: Date;
}

// =============================================================================
// SKIN INFECTION TYPES
// =============================================================================

export interface SkinInfectionRequest {
  file: string | File | Blob;
  affectedArea?: string;
  duration?: string;
  symptoms?: string[];
  previousTreatments?: string[];
  allergies?: string[];
  medicalHistory?: string[];
}

export interface SkinCondition {
  name: string;
  confidence: number;
  icd10Code?: string;
  category: 'fungal' | 'bacterial' | 'viral' | 'parasitic' | 'inflammatory';
  severity?: 'mild' | 'moderate' | 'severe';
  description?: string;
}

export interface SkinInfectionAnalysis {
  id: string;
  userId: string;
  imageUrl: string;
  identifiedConditions: SkinCondition[];
  primaryDiagnosis?: SkinCondition;
  differentialDiagnoses: SkinCondition[];
  recommendations: Recommendation[];
  treatmentSuggestions: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  followUpRequired: boolean;
  disclaimer: string;
  modelInfo?: ModelInfo;
  createdAt: Date;
}

export interface SupportedSkinConditions {
  fungal: { name: string; conditions: Array<{ id: string; name: string; icd10: string }> };
  bacterial: { name: string; conditions: Array<{ id: string; name: string; icd10: string }> };
  viral: { name: string; conditions: Array<{ id: string; name: string; icd10: string }> };
  parasitic: { name: string; conditions: Array<{ id: string; name: string; icd10: string }> };
  inflammatory: { name: string; conditions: Array<{ id: string; name: string; icd10: string }> };
}

// =============================================================================
// EYE DIAGNOSIS TYPES
// =============================================================================

export interface EyeDiagnosisRequest {
  file: string | File | Blob;
  eyeSide?: 'left' | 'right' | 'both';
  symptoms?: string[];
  symptomDuration?: string;
  painLevel?: number;
  visionChanges?: string[];
  medicalHistory?: string[];
  currentMedications?: string[];
  allergies?: string[];
  familyHistory?: string[];
  lastEyeExam?: string;
  wearingCorrectiveLenses?: boolean;
  lensType?: string;
}

export interface EyeCondition {
  name: string;
  confidence: number;
  icd10Code?: string;
  category: 'refractive' | 'infection' | 'inflammation' | 'degenerative' | 'vascular' | 'neurological' | 'structural';
  severity?: 'mild' | 'moderate' | 'severe';
  affectedArea?: string;
  description?: string;
}

export interface EyeDiagnosisAnalysis {
  id: string;
  userId: string;
  imageUrl: string;
  eyeSide: 'left' | 'right' | 'both';
  identifiedConditions: EyeCondition[];
  primaryDiagnosis?: EyeCondition;
  differentialDiagnoses: EyeCondition[];
  visualAcuityEstimate?: string;
  recommendations: Recommendation[];
  treatmentSuggestions: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  followUpRequired: boolean;
  referralRecommended: boolean;
  disclaimer: string;
  modelInfo?: ModelInfo;
  createdAt: Date;
}

export interface SupportedEyeConditions {
  refractive: { description: string; conditions: Array<{ id: string; name: string; icd10: string }> };
  infection: { description: string; conditions: Array<{ id: string; name: string; icd10: string }> };
  inflammation: { description: string; conditions: Array<{ id: string; name: string; icd10: string }> };
  degenerative: { description: string; conditions: Array<{ id: string; name: string; icd10: string }> };
  vascular: { description: string; conditions: Array<{ id: string; name: string; icd10: string }> };
  neurological: { description: string; conditions: Array<{ id: string; name: string; icd10: string }> };
  structural: { description: string; conditions: Array<{ id: string; name: string; icd10: string }> };
}

// =============================================================================
// WOUND HEALING TYPES
// =============================================================================

export interface WoundAnalysisRequest {
  file: string | File | Blob;
  woundProfileId?: string;
  woundType?: string;
  bodyLocation?: string;
  painLevel?: number;
  symptoms?: string[];
  currentTreatments?: string[];
  recentChanges?: string;
}

export interface WoundProfile {
  id: string;
  userId: string;
  name: string;
  woundType: string;
  bodyLocation: string;
  bodyLocationDetails?: string;
  etiology?: string;
  woundOnsetDate?: Date;
  notes?: string;
  status: 'active' | 'archived';
  analysisCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WoundProfileRequest {
  name: string;
  woundType: string;
  bodyLocation: string;
  bodyLocationDetails?: string;
  etiology?: string;
  woundOnsetDate?: Date;
  notes?: string;
}

export interface WoundMeasurement {
  length?: number;
  width?: number;
  depth?: number;
  area?: number;
  unit: 'cm' | 'mm' | 'inches';
}

export interface WoundHealingAnalysis {
  id: string;
  userId: string;
  woundProfileId?: string;
  imageUrl: string;
  woundType: string;
  bodyLocation: string;
  measurements?: WoundMeasurement;
  healingStage: 'inflammatory' | 'proliferative' | 'maturation' | 'chronic';
  healingProgress: 'improving' | 'stable' | 'declining' | 'unknown';
  tissueAnalysis: {
    granulation?: number;
    epithelial?: number;
    slough?: number;
    necrotic?: number;
  };
  infectionSigns: string[];
  infectionRisk: 'low' | 'medium' | 'high';
  recommendations: Recommendation[];
  careInstructions: string[];
  warningSignsToWatch: string[];
  nextAnalysisRecommended?: Date;
  disclaimer: string;
  modelInfo?: ModelInfo;
  createdAt: Date;
}

export interface WoundTimeline {
  profileId: string;
  analyses: Array<{
    id: string;
    date: Date;
    healingProgress: string;
    measurements?: WoundMeasurement;
    infectionRisk: string;
  }>;
  overallTrend: 'improving' | 'stable' | 'declining' | 'insufficient_data';
}

export interface WoundReferenceData {
  woundTypes: Array<{ id: string; name: string }>;
  bodyLocations: {
    head: string[];
    torso: string[];
    arms: string[];
    legs: string[];
    other: string[];
  };
}

// =============================================================================
// DRUG VERIFICATION TYPES
// =============================================================================

export interface DrugVerificationRequest {
  drugName?: string;
  manufacturer?: string;
  batchNumber?: string;
  ndc?: string;
  barcode?: string;
  image?: string | File | Blob;
}

export interface DrugVerificationResult {
  id: string;
  userId: string;
  verificationStatus: 'verified' | 'unverified' | 'suspicious' | 'counterfeit';
  drugInfo?: {
    name: string;
    genericName?: string;
    manufacturer: string;
    ndc?: string;
    activeIngredients?: string[];
    dosageForm?: string;
    strength?: string;
  };
  batchInfo?: {
    batchNumber: string;
    expirationDate?: Date;
    manufacturingDate?: Date;
    isRecalled: boolean;
    recallInfo?: string;
  };
  verificationDetails: {
    ndcVerified: boolean;
    manufacturerVerified: boolean;
    packagingVerified: boolean;
    recallChecked: boolean;
  };
  warnings: string[];
  recommendations: string[];
  confidence: number;
  disclaimer: string;
  createdAt: Date;
}

export interface DrugVerificationStats {
  totalVerifications: number;
  verified: number;
  unverified: number;
  suspicious: number;
  counterfeit: number;
  lastVerificationDate?: Date;
}

// =============================================================================
// FHIR TYPES
// =============================================================================

export type FHIRResourceType =
  | 'Patient'
  | 'Practitioner'
  | 'Observation'
  | 'Condition'
  | 'MedicationStatement'
  | 'DiagnosticReport'
  | 'DocumentReference'
  | 'AllergyIntolerance'
  | 'Encounter';

export interface FHIRResource {
  resourceType: FHIRResourceType;
  id?: string;
  meta?: {
    versionId?: string;
    lastUpdated?: string;
    source?: string;
    profile?: string[];
  };
  [key: string]: any;
}

export interface FHIRRecord {
  id: string;
  userId: string;
  resourceType: FHIRResourceType;
  resource: FHIRResource;
  createdAt: Date;
  updatedAt: Date;
  visibility?: 'private' | 'shared' | 'public';
  status?: 'active' | 'archived' | 'deleted';
}

export interface FHIRSearchParams {
  resourceType?: FHIRResourceType;
  category?: string;
  status?: 'active' | 'archived';
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

export interface FHIRPatientSummary {
  patient: FHIRResource;
  observations: FHIRResource[];
  conditions: FHIRResource[];
  medications: FHIRResource[];
  allergies: FHIRResource[];
  documents: FHIRResource[];
}

export interface FHIRBundle {
  resourceType: 'Bundle';
  type: 'searchset' | 'collection';
  total: number;
  entry: Array<{
    resource: FHIRResource;
    fullUrl?: string;
  }>;
}

// =============================================================================
// SUBSCRIPTION TYPES
// =============================================================================

export type AISubscriptionTier = 'free' | 'basic' | 'standard' | 'premium' | 'premium_plus';

export interface AISubscriptionPlan {
  tier: AISubscriptionTier;
  name: string;
  monthlyPrice: number;
  currency?: string;
  aiRequestsPerMonth: number;
  aiRequestsPerDay: number;
  features: {
    multiPatientManagement: boolean;
    [key: string]: any;
  };
  isActive: boolean;
}

export interface AISubscriptionUsage {
  aiRequestsThisMonth: number;
  aiRequestsToday: number;
  lastResetDate: string;
  lastDailyReset: string;
}

export interface AISubscriptionLimits {
  aiRequestsPerMonth: number;
  aiRequestsPerDay: number;
  multiPatientManagement: boolean;
}

export interface UserAISubscription {
  tier: AISubscriptionTier;
  planName: string;
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  startDate: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  renewalDate?: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  paymentMethod?: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  limits: AISubscriptionLimits;
  usage: AISubscriptionUsage;
  autoRenew: boolean;
  previousTier?: AISubscriptionTier;
  createdAt: string;
  updatedAt: string;
}

export interface AIUsageResponse {
  subscription: {
    tier: AISubscriptionTier;
    planName: string;
    status: string;
  };
  limits: AISubscriptionLimits;
  usage: AISubscriptionUsage;
  sixHourUsage: {
    current: number;
    limit: number;
    remaining: number;
    percentageUsed: number;
    percentageRemaining: number;
  };
  usagePercentages: {
    monthly: number;
    weekly: number;
    daily: number;
    sixHour: number;
  };
  remainingRequests: {
    monthly: number;
    weekly: number;
    daily: number;
    sixHour: number;
  };
  resetTimes: {
    sixHour: string;
    daily: string;
    weekly: string;
    monthly: string;
  };
  aiToolUsage: Array<{
    toolType: string;
    displayName: string;
    totalCount: number;
    countThisMonth: number;
    countThisWeek: number;
    countToday: number;
    lastUsed: string | null;
  }>;
  categoryUsage: Array<{
    category: string;
    displayName: string;
    maxRequests: number;
    period: string;
    currentCount: number;
    remaining: number;
    forbidden: boolean;
    unlimited: boolean;
    percentageUsed: number;
  }>;
}

export interface SubscriptionPurchaseRequest {
  tier: AISubscriptionTier;
  billingCycle?: 'monthly' | 'yearly';
  paymentMethod?: string;
  currency?: string;
  promoCode?: string;
}

export interface SubscriptionChangeRequest {
  newTier: AISubscriptionTier;
  reason?: string;
  immediateChange?: boolean;
}

// =============================================================================
// SDK CLIENT CLASS
// =============================================================================

/**
 * NostraHealthAI SDK Client
 *
 * Official SDK for interacting with NostraHealthAI Medical AI Platform
 *
 * @example
 * ```typescript
 * const nostra = new NostraHealthAI({
 *   apiKey: 'your-api-key',
 *   baseURL: 'https://www.api.nostrahealth.com'
 * });
 *
 * // Medical Chat
 * const response = await nostra.chat({ message: 'What causes high blood pressure?' });
 *
 * // Skin Analysis
 * const skinJob = await nostra.skin.analyze({ file: skinImage });
 * const skinResult = await nostra.skin.waitForCompletion(skinJob);
 *
 * // Eye Diagnosis
 * const eyeJob = await nostra.eye.analyze({ file: eyeImage });
 * const eyeResult = await nostra.eye.waitForCompletion(eyeJob);
 *
 * // Wound Tracking
 * const profile = await nostra.wound.createProfile({ name: 'Left Leg Wound', ... });
 * const woundJob = await nostra.wound.analyze({ file: woundImage, woundProfileId: profile.id });
 *
 * // Drug Verification
 * const verification = await nostra.drug.verify({ drugName: 'Aspirin', ... });
 *
 * // FHIR Records
 * const summary = await nostra.fhir.getPatientSummary();
 * const observations = await nostra.fhir.getObservations({ category: 'vital-signs' });
 * ```
 */
/**
 * Reads a file from the filesystem in Node.js environments.
 * Throws a helpful error in browser environments.
 */
// Dynamic import wrapper that prevents bundlers (Webpack, Rollup, Vite, esbuild)
// from statically analyzing and trying to bundle Node.js built-in modules.
// eslint-disable-next-line @typescript-eslint/no-implied-eval
const _importNodeModule = new Function('moduleName', 'return import(moduleName)') as (name: string) => Promise<any>;

async function readNodeFile(filePath: string): Promise<{ bytes: Uint8Array; basename: string }> {
  if (typeof globalThis.process !== 'undefined' && globalThis.process.versions?.node) {
    const fs = await _importNodeModule('fs');
    const path = await _importNodeModule('path');
    const buffer = fs.readFileSync(filePath);
    return { bytes: new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength), basename: path.basename(filePath) };
  }
  throw new NostraHealthAIError(
    'File path strings are only supported in Node.js. In the browser, pass a File or Blob object instead.'
  );
}

export class NostraHealthAI {
  private client: AxiosInstance;
  private apiKey: string;
  private organizationId?: string;
  private userId?: string;
  private prefix: string;

  /**
   * Get the underlying authenticated axios client for custom API calls
   */
  public getAxiosClient(): AxiosInstance {
    return this.client;
  }

  // Sub-modules
  public readonly skin: SkinInfectionModule;
  public readonly eye: EyeDiagnosisModule;
  public readonly wound: WoundHealingModule;
  public readonly drug: DrugVerificationModule;
  public readonly fhir: FHIRModule;
  public readonly subscriptions: SubscriptionModule;

  constructor(config: NostraHealthAIConfig) {
    this.apiKey = config.apiKey;
    this.organizationId = config.organizationId;
    this.userId = config.userId;

    this.client = axios.create({
      baseURL: config.baseURL || 'https://www.api.nostrahealth.com',
      timeout: config.timeout || 60000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<any>) => {
        if (error.response) {
          throw new NostraHealthAIError(
            error.response.data?.error || error.message,
            error.response.status,
            error.response.data
          );
        }
        throw new NostraHealthAIError(error.message);
      }
    );

    // Build route prefix:
    // - org-user scoped: /api/v1/organizations/:orgId/users/:userId
    // - org scoped: /api/v1/organizations/:orgId
    // - consumer: /api/v1
    let orgPrefix: string;
    if (this.organizationId && this.userId) {
      orgPrefix = `/api/v1/organizations/${this.organizationId}/users/${this.userId}`;
    } else if (this.organizationId) {
      orgPrefix = `/api/v1/organizations/${this.organizationId}`;
    } else {
      orgPrefix = '/api/v1';
    }
    this.prefix = orgPrefix;

    // Initialize sub-modules with org-aware prefix
    this.skin = new SkinInfectionModule(this.client, orgPrefix);
    this.eye = new EyeDiagnosisModule(this.client, orgPrefix);
    this.wound = new WoundHealingModule(this.client, orgPrefix);
    this.drug = new DrugVerificationModule(this.client, orgPrefix);
    this.fhir = new FHIRModule(this.client);
    this.subscriptions = new SubscriptionModule(this.client);
  }

  // ===========================================================================
  // MEDICAL CHAT
  // ===========================================================================

  /**
   * Send a message to the medical AI assistant
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    const response = await this.client.post<{ success: boolean; data: ChatResponse }>(
      `${this.prefix}/ai/chat`,
      request
    );

    if (!response.data.success) {
      throw new NostraHealthAIError('Chat request failed');
    }

    return response.data.data;
  }

  /**
   * Send an audio message for voice-based conversation
   */
  async audioChat(audioFile: string | File | Blob, conversationId?: string): Promise<{
    transcription: string;
    response: string;
    audioResponseUrl?: string;
    conversationId: string;
  }> {
    const formData = new FormData();
    formData.append('audio', await this.prepareFile(audioFile, 'audio.webm'));
    if (conversationId) {
      formData.append('conversationId', conversationId);
    }

    const response = await this.client.post('/api/v1/ai/audio-chat', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.data;
  }

  /**
   * Get all conversations for the current user
   */
  async getConversations(): Promise<Conversation[]> {
    const response = await this.client.get<{ success: boolean; data: Conversation[] }>(
      '/api/v1/ai/conversations'
    );
    return response.data.data;
  }

  /**
   * Get messages for a specific conversation
   */
  async getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
    const response = await this.client.get<{ success: boolean; data: ChatMessage[] }>(
      `/api/v1/ai/conversations/${conversationId}/messages`
    );
    return response.data.data;
  }

  // ===========================================================================
  // MEDICAL FILE ANALYSIS
  // ===========================================================================

  /**
   * Analyze a medical file (image, lab report, etc.)
   */
  async analyzeFile(file: string | File | Blob): Promise<string> {
    const formData = new FormData();
    formData.append('file', await this.prepareFile(file));

    const response = await this.client.post<{
      success: boolean;
      jobId: string;
      pollUrl: string;
    }>(`${this.prefix}/ai/analyze`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (!response.data.success) {
      throw new NostraHealthAIError('File analysis request failed');
    }

    return response.data.jobId;
  }

  /**
   * Get the status of a file analysis job
   */
  async getJobStatus(jobId: string): Promise<JobStatus<Analysis>> {
    const response = await this.client.get<{ success: boolean } & JobStatus<Analysis>>(
      `${this.prefix}/ai/analyze/job/${jobId}`
    );

    return {
      jobId: response.data.jobId,
      status: response.data.status,
      progress: response.data.progress,
      metadata: response.data.metadata,
      data: response.data.data,
      error: response.data.error,
    };
  }

  /**
   * Wait for a file analysis job to complete
   */
  async waitForJobCompletion(
    jobId: string,
    pollInterval: number = 2000,
    maxAttempts: number = 60
  ): Promise<JobStatus<Analysis>> {
    let attempts = 0;

    while (attempts < maxAttempts) {
      const status = await this.getJobStatus(jobId);

      if (status.status === 'completed') {
        return status;
      }

      if (status.status === 'failed') {
        throw new NostraHealthAIError(`Job failed: ${status.error || 'Unknown error'}`);
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
      attempts++;
    }

    throw new NostraHealthAIError(`Job polling timeout after ${maxAttempts} attempts`);
  }

  /**
   * Get all analysis jobs for the current user
   */
  async getUserJobs(): Promise<any[]> {
    const response = await this.client.get<{ success: boolean; jobs: any[] }>(
      `${this.prefix}/ai/jobs`
    );
    return response.data.jobs;
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================

  private async prepareFile(file: string | File | Blob, defaultName: string = 'file'): Promise<Blob> {
    if (typeof file === 'string') {
      const { bytes, basename } = await readNodeFile(file);
      return new Blob([bytes as BlobPart], { type: this.getMimeType(basename) });
    }
    return file;
  }

  private getMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'pdf': 'application/pdf',
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'webm': 'audio/webm',
      'm4a': 'audio/mp4',
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
  }
}

// =============================================================================
// SKIN INFECTION MODULE
// =============================================================================

class SkinInfectionModule {
  private prefix: string;
  constructor(private client: AxiosInstance, routePrefix: string = '/api/v1') {
    this.prefix = `${routePrefix}/ai/skin-infections`;
  }

  /**
   * Analyze a skin image for infections and conditions
   */
  async analyze(request: SkinInfectionRequest): Promise<string> {
    const formData = new FormData();

    if (typeof request.file === 'string') {
      const { bytes, basename } = await readNodeFile(request.file);
      formData.append('file', new Blob([bytes as BlobPart]), basename);
    } else {
      formData.append('file', request.file);
    }

    if (request.affectedArea) formData.append('affectedArea', request.affectedArea);
    if (request.duration) formData.append('duration', request.duration);
    if (request.symptoms) formData.append('symptoms', request.symptoms.join(','));
    if (request.previousTreatments) formData.append('previousTreatments', request.previousTreatments.join(','));
    if (request.allergies) formData.append('allergies', request.allergies.join(','));
    if (request.medicalHistory) formData.append('medicalHistory', request.medicalHistory.join(','));

    const response = await this.client.post<{ success: boolean; jobId: string }>(
      this.prefix,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return response.data.jobId;
  }

  /**
   * Get the status of a skin analysis job
   */
  async getJobStatus(jobId: string): Promise<JobStatus<SkinInfectionAnalysis>> {
    const response = await this.client.get(`${this.prefix}/job/${jobId}`);
    return response.data;
  }

  /**
   * Wait for a skin analysis job to complete
   */
  async waitForCompletion(
    jobId: string,
    pollInterval: number = 2000,
    maxAttempts: number = 60
  ): Promise<JobStatus<SkinInfectionAnalysis>> {
    let attempts = 0;

    while (attempts < maxAttempts) {
      const status = await this.getJobStatus(jobId);

      if (status.status === 'completed') return status;
      if (status.status === 'failed') {
        throw new NostraHealthAIError(`Skin analysis failed: ${status.error}`);
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
      attempts++;
    }

    throw new NostraHealthAIError('Skin analysis timeout');
  }

  /**
   * Get all skin analyses for the current user
   */
  async getAllAnalyses(): Promise<SkinInfectionAnalysis[]> {
    const response = await this.client.get<{ success: boolean; data: SkinInfectionAnalysis[] }>(
      this.prefix
    );
    return response.data.data;
  }

  /**
   * Get a specific skin analysis by ID
   */
  async getAnalysis(analysisId: string): Promise<SkinInfectionAnalysis> {
    const response = await this.client.get<{ success: boolean; data: SkinInfectionAnalysis }>(
      `${this.prefix}/${analysisId}`
    );
    return response.data.data;
  }

  /**
   * Delete a skin analysis
   */
  async deleteAnalysis(analysisId: string): Promise<void> {
    await this.client.delete(`${this.prefix}/${analysisId}`);
  }

  /**
   * Get list of supported skin conditions
   */
  async getSupportedConditions(): Promise<SupportedSkinConditions> {
    const response = await this.client.get<{ success: boolean; data: SupportedSkinConditions }>(
      `${this.prefix}/conditions`
    );
    return response.data.data;
  }
}

// =============================================================================
// EYE DIAGNOSIS MODULE
// =============================================================================

class EyeDiagnosisModule {
  private prefix: string;
  constructor(private client: AxiosInstance, routePrefix: string = '/api/v1') {
    this.prefix = `${routePrefix}/ai/eye-diagnosis`;
  }

  /**
   * Analyze an eye image for conditions
   */
  async analyze(request: EyeDiagnosisRequest): Promise<string> {
    const formData = new FormData();

    if (typeof request.file === 'string') {
      const { bytes, basename } = await readNodeFile(request.file);
      formData.append('file', new Blob([bytes as BlobPart]), basename);
    } else {
      formData.append('file', request.file);
    }

    if (request.eyeSide) formData.append('eyeSide', request.eyeSide);
    if (request.symptoms) formData.append('symptoms', request.symptoms.join(','));
    if (request.symptomDuration) formData.append('symptomDuration', request.symptomDuration);
    if (request.painLevel !== undefined) formData.append('painLevel', request.painLevel.toString());
    if (request.visionChanges) formData.append('visionChanges', request.visionChanges.join(','));
    if (request.medicalHistory) formData.append('medicalHistory', request.medicalHistory.join(','));
    if (request.currentMedications) formData.append('currentMedications', request.currentMedications.join(','));
    if (request.allergies) formData.append('allergies', request.allergies.join(','));
    if (request.familyHistory) formData.append('familyHistory', request.familyHistory.join(','));
    if (request.lastEyeExam) formData.append('lastEyeExam', request.lastEyeExam);
    if (request.wearingCorrectiveLenses !== undefined) {
      formData.append('wearingCorrectiveLenses', request.wearingCorrectiveLenses.toString());
    }
    if (request.lensType) formData.append('lensType', request.lensType);

    const response = await this.client.post<{ success: boolean; jobId: string }>(
      this.prefix,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return response.data.jobId;
  }

  /**
   * Get the status of an eye diagnosis job
   */
  async getJobStatus(jobId: string): Promise<JobStatus<EyeDiagnosisAnalysis>> {
    const response = await this.client.get(`${this.prefix}/job/${jobId}`);
    return response.data;
  }

  /**
   * Wait for an eye diagnosis job to complete
   */
  async waitForCompletion(
    jobId: string,
    pollInterval: number = 2000,
    maxAttempts: number = 60
  ): Promise<JobStatus<EyeDiagnosisAnalysis>> {
    let attempts = 0;

    while (attempts < maxAttempts) {
      const status = await this.getJobStatus(jobId);

      if (status.status === 'completed') return status;
      if (status.status === 'failed') {
        throw new NostraHealthAIError(`Eye diagnosis failed: ${status.error}`);
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
      attempts++;
    }

    throw new NostraHealthAIError('Eye diagnosis timeout');
  }

  /**
   * Get all eye diagnoses for the current user
   */
  async getAllAnalyses(options?: { limit?: number; lastDocId?: string }): Promise<{
    data: EyeDiagnosisAnalysis[];
    hasMore: boolean;
    lastDocId: string | null;
  }> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.lastDocId) params.append('lastDocId', options.lastDocId);

    const response = await this.client.get(`${this.prefix}?${params}`);
    return response.data;
  }

  /**
   * Get a specific eye diagnosis by ID
   */
  async getAnalysis(analysisId: string): Promise<EyeDiagnosisAnalysis> {
    const response = await this.client.get<{ success: boolean; data: EyeDiagnosisAnalysis }>(
      `${this.prefix}/${analysisId}`
    );
    return response.data.data;
  }

  /**
   * Delete an eye diagnosis
   */
  async deleteAnalysis(analysisId: string): Promise<void> {
    await this.client.delete(`${this.prefix}/${analysisId}`);
  }

  /**
   * Get list of supported eye conditions
   */
  async getSupportedConditions(): Promise<SupportedEyeConditions> {
    const response = await this.client.get<{ success: boolean; data: SupportedEyeConditions }>(
      `${this.prefix}/conditions`
    );
    return response.data.data;
  }
}

// =============================================================================
// WOUND HEALING MODULE
// =============================================================================

class WoundHealingModule {
  private prefix: string;
  constructor(private client: AxiosInstance, routePrefix: string = '/api/v1') {
    this.prefix = `${routePrefix}/ai/wound-healing`;
  }

  /**
   * Analyze a wound image
   */
  async analyze(request: WoundAnalysisRequest): Promise<string> {
    const formData = new FormData();

    if (typeof request.file === 'string') {
      const { bytes, basename } = await readNodeFile(request.file);
      formData.append('file', new Blob([bytes as BlobPart]), basename);
    } else {
      formData.append('file', request.file);
    }

    if (request.woundProfileId) formData.append('woundProfileId', request.woundProfileId);
    if (request.woundType) formData.append('woundType', request.woundType);
    if (request.bodyLocation) formData.append('bodyLocation', request.bodyLocation);
    if (request.painLevel !== undefined) formData.append('painLevel', request.painLevel.toString());
    if (request.symptoms) formData.append('symptoms', request.symptoms.join(','));
    if (request.currentTreatments) formData.append('currentTreatments', request.currentTreatments.join(','));
    if (request.recentChanges) formData.append('recentChanges', request.recentChanges);

    const response = await this.client.post<{ success: boolean; jobId: string }>(
      `${this.prefix}/analyze`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return response.data.jobId;
  }

  /**
   * Get the status of a wound analysis job
   */
  async getJobStatus(jobId: string): Promise<JobStatus<WoundHealingAnalysis>> {
    const response = await this.client.get(`${this.prefix}/job/${jobId}`);
    return response.data;
  }

  /**
   * Wait for a wound analysis job to complete
   */
  async waitForCompletion(
    jobId: string,
    pollInterval: number = 2000,
    maxAttempts: number = 60
  ): Promise<JobStatus<WoundHealingAnalysis>> {
    let attempts = 0;

    while (attempts < maxAttempts) {
      const status = await this.getJobStatus(jobId);

      if (status.status === 'completed') return status;
      if (status.status === 'failed') {
        throw new NostraHealthAIError(`Wound analysis failed: ${status.error}`);
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
      attempts++;
    }

    throw new NostraHealthAIError('Wound analysis timeout');
  }

  /**
   * Get all wound analyses for the current user
   */
  async getAllAnalyses(limit?: number): Promise<WoundHealingAnalysis[]> {
    const params = limit ? `?limit=${limit}` : '';
    const response = await this.client.get<{ success: boolean; data: WoundHealingAnalysis[] }>(
      `${this.prefix}/analyses${params}`
    );
    return response.data.data;
  }

  /**
   * Get a specific wound analysis by ID
   */
  async getAnalysis(analysisId: string): Promise<WoundHealingAnalysis> {
    const response = await this.client.get<{ success: boolean; data: WoundHealingAnalysis }>(
      `${this.prefix}/analyses/${analysisId}`
    );
    return response.data.data;
  }

  /**
   * Delete a wound analysis
   */
  async deleteAnalysis(analysisId: string): Promise<void> {
    await this.client.delete(`${this.prefix}/analyses/${analysisId}`);
  }

  // --- Wound Profiles ---

  /**
   * Create a new wound profile for tracking
   */
  async createProfile(request: WoundProfileRequest): Promise<WoundProfile> {
    const response = await this.client.post<{ success: boolean; data: WoundProfile }>(
      `${this.prefix}/profiles`,
      request
    );
    return response.data.data;
  }

  /**
   * Get all wound profiles for the current user
   */
  async getProfiles(): Promise<{
    active: WoundProfile[];
    archived: WoundProfile[];
    activeCount: number;
    archivedCount: number;
  }> {
    const response = await this.client.get(`${this.prefix}/profiles`);
    return response.data.data;
  }

  /**
   * Get a specific wound profile with recent analyses
   */
  async getProfile(profileId: string): Promise<{
    profile: WoundProfile;
    recentAnalyses: WoundHealingAnalysis[];
  }> {
    const response = await this.client.get(`${this.prefix}/profiles/${profileId}`);
    return response.data.data;
  }

  /**
   * Update a wound profile
   */
  async updateProfile(profileId: string, updates: Partial<WoundProfileRequest>): Promise<WoundProfile> {
    const response = await this.client.put<{ success: boolean; data: WoundProfile }>(
      `${this.prefix}/profiles/${profileId}`,
      updates
    );
    return response.data.data;
  }

  /**
   * Archive a wound profile (mark as healed)
   */
  async archiveProfile(profileId: string): Promise<void> {
    await this.client.post(`${this.prefix}/profiles/${profileId}/archive`);
  }

  /**
   * Delete a wound profile and all associated analyses
   */
  async deleteProfile(profileId: string): Promise<void> {
    await this.client.delete(`${this.prefix}/profiles/${profileId}`);
  }

  /**
   * Get wound healing timeline for a profile
   */
  async getTimeline(profileId: string): Promise<WoundTimeline | null> {
    const response = await this.client.get<{ success: boolean; data: WoundTimeline | null }>(
      `${this.prefix}/profiles/${profileId}/timeline`
    );
    return response.data.data;
  }

  /**
   * Get reference data (wound types and body locations)
   */
  async getReferenceData(): Promise<WoundReferenceData> {
    const response = await this.client.get<{ success: boolean; data: WoundReferenceData }>(
      `${this.prefix}/reference-data`
    );
    return response.data.data;
  }
}

// =============================================================================
// DRUG VERIFICATION MODULE
// =============================================================================

class DrugVerificationModule {
  private prefix: string;
  constructor(private client: AxiosInstance, routePrefix: string = '/api/v1') {
    this.prefix = `${routePrefix}/ai/drug-verification`;
  }

  /**
   * Verify a drug's authenticity
   */
  async verify(request: DrugVerificationRequest): Promise<DrugVerificationResult> {
    const formData = new FormData();

    if (request.drugName) formData.append('drugName', request.drugName);
    if (request.manufacturer) formData.append('manufacturer', request.manufacturer);
    if (request.batchNumber) formData.append('batchNumber', request.batchNumber);
    if (request.ndc) formData.append('ndc', request.ndc);
    if (request.barcode) formData.append('barcode', request.barcode);

    if (request.image) {
      if (typeof request.image === 'string') {
        const { bytes, basename } = await readNodeFile(request.image);
        formData.append('image', new Blob([bytes as BlobPart]), basename);
      } else {
        formData.append('image', request.image);
      }
    }

    const response = await this.client.post<{ success: boolean; data: DrugVerificationResult }>(
      `${this.prefix}/verify`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return response.data.data;
  }

  /**
   * Verify multiple drugs in batch
   */
  async batchVerify(drugs: DrugVerificationRequest[]): Promise<DrugVerificationResult[]> {
    const response = await this.client.post<{ success: boolean; data: DrugVerificationResult[] }>(
      `${this.prefix}/verify-batch`,
      { drugs }
    );
    return response.data.data;
  }

  /**
   * Get all drug verifications for the current user
   */
  async getVerifications(): Promise<DrugVerificationResult[]> {
    const response = await this.client.get<{ success: boolean; data: DrugVerificationResult[] }>(
      `${this.prefix}/verifications`
    );
    return response.data.data;
  }

  /**
   * Get a specific drug verification by ID
   */
  async getVerification(verificationId: string): Promise<DrugVerificationResult> {
    const response = await this.client.get<{ success: boolean; data: DrugVerificationResult }>(
      `${this.prefix}/verifications/${verificationId}`
    );
    return response.data.data;
  }

  /**
   * Get drug verification statistics
   */
  async getStats(): Promise<DrugVerificationStats> {
    const response = await this.client.get<{ success: boolean; data: DrugVerificationStats }>(
      `${this.prefix}/verifications/stats`
    );
    return response.data.data;
  }

  /**
   * Delete a drug verification record
   */
  async deleteVerification(verificationId: string): Promise<void> {
    await this.client.delete(`${this.prefix}/verifications/${verificationId}`);
  }
}

// =============================================================================
// FHIR MODULE
// =============================================================================

class FHIRModule {
  constructor(private client: AxiosInstance) {}

  /**
   * Get comprehensive patient summary (all FHIR resources)
   */
  async getPatientSummary(): Promise<FHIRPatientSummary> {
    const response = await this.client.get<{ success: boolean; data: FHIRPatientSummary }>(
      '/api/v1/fhir/patient/summary'
    );
    return response.data.data;
  }

  /**
   * Get observations (vital signs, lab results)
   */
  async getObservations(options?: { category?: string }): Promise<FHIRRecord[]> {
    const params = options?.category ? `?category=${options.category}` : '';
    const response = await this.client.get<{ success: boolean; data: FHIRRecord[] }>(
      `/api/v1/fhir/observations${params}`
    );
    return response.data.data;
  }

  /**
   * Get conditions (diagnoses)
   */
  async getConditions(): Promise<FHIRRecord[]> {
    const response = await this.client.get<{ success: boolean; data: FHIRRecord[] }>(
      '/api/v1/fhir/conditions'
    );
    return response.data.data;
  }

  /**
   * Get medication statements
   */
  async getMedications(): Promise<FHIRRecord[]> {
    const response = await this.client.get<{ success: boolean; data: FHIRRecord[] }>(
      '/api/v1/fhir/medications'
    );
    return response.data.data;
  }

  /**
   * Get allergy intolerances
   */
  async getAllergies(): Promise<FHIRRecord[]> {
    const response = await this.client.get<{ success: boolean; data: FHIRRecord[] }>(
      '/api/v1/fhir/allergies'
    );
    return response.data.data;
  }

  /**
   * Get document references (prescriptions, medical records)
   */
  async getDocuments(options?: { type?: string }): Promise<FHIRRecord[]> {
    const params = options?.type ? `?type=${options.type}` : '';
    const response = await this.client.get<{ success: boolean; data: FHIRRecord[] }>(
      `/api/v1/fhir/documents${params}`
    );
    return response.data.data;
  }

  /**
   * Search FHIR records with advanced filters
   */
  async search(params: FHIRSearchParams): Promise<FHIRRecord[]> {
    const response = await this.client.post<{ success: boolean; data: FHIRRecord[] }>(
      '/api/v1/fhir/search',
      params
    );
    return response.data.data;
  }

  /**
   * Get FHIR records by resource type
   */
  async getByResourceType(resourceType: FHIRResourceType, limit?: number): Promise<FHIRRecord[]> {
    const params = limit ? `?limit=${limit}` : '';
    const response = await this.client.get<{ success: boolean; data: FHIRRecord[] }>(
      `/api/v1/fhir/${resourceType}${params}`
    );
    return response.data.data;
  }

  /**
   * Get all FHIR records for the current user
   */
  async getAllRecords(options?: { limit?: number; lastDocId?: string }): Promise<{
    data: FHIRRecord[];
    hasMore: boolean;
    lastDocId: string | null;
  }> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.lastDocId) params.append('lastDocId', options.lastDocId);

    const response = await this.client.get(`/api/v1/fhir?${params}`);
    return response.data;
  }

  /**
   * Get a specific FHIR record by ID
   */
  async getRecord(recordId: string): Promise<FHIRRecord> {
    const response = await this.client.get<{ success: boolean; data: FHIRRecord }>(
      `/api/v1/fhir/${recordId}`
    );
    return response.data.data;
  }

  /**
   * Update a FHIR record
   */
  async updateRecord(recordId: string, resource: Partial<FHIRResource>): Promise<FHIRRecord> {
    const response = await this.client.put<{ success: boolean; data: FHIRRecord }>(
      `/api/v1/fhir/${recordId}`,
      { resource }
    );
    return response.data.data;
  }

  /**
   * Delete a FHIR record (soft delete)
   */
  async deleteRecord(recordId: string): Promise<void> {
    await this.client.delete(`/api/v1/fhir/${recordId}`);
  }

  /**
   * Archive a FHIR record
   */
  async archiveRecord(recordId: string): Promise<void> {
    await this.client.post(`/api/v1/fhir/${recordId}/archive`);
  }

  /**
   * Export patient data as FHIR Bundle
   */
  async exportBundle(resourceTypes?: FHIRResourceType[]): Promise<FHIRBundle> {
    const params = resourceTypes ? `?types=${resourceTypes.join(',')}` : '';
    const response = await this.client.get<{ success: boolean; data: FHIRBundle }>(
      `/api/v1/fhir/export${params}`
    );
    return response.data.data;
  }
}

// =============================================================================
// SUBSCRIPTION MODULE
// =============================================================================

class SubscriptionModule {
  constructor(private client: AxiosInstance) {}

  /**
   * Get all available subscription plans
   */
  async getPlans(): Promise<{ plans: AISubscriptionPlan[]; categoryLimitsPerTier: Record<string, any> }> {
    const response = await this.client.get<{
      success: boolean;
      plans: AISubscriptionPlan[];
      categoryLimitsPerTier: Record<string, any>;
    }>('/api/v1/ai/subscriptions/plans');
    return {
      plans: response.data.plans,
      categoryLimitsPerTier: response.data.categoryLimitsPerTier,
    };
  }

  /**
   * Get details for a specific subscription plan
   */
  async getPlanDetails(tier: AISubscriptionTier): Promise<AISubscriptionPlan> {
    const response = await this.client.get<{ success: boolean; plan: AISubscriptionPlan }>(
      `/api/v1/ai/subscriptions/plans/${tier}`
    );
    return response.data.plan;
  }

  /**
   * Get current user's subscription
   */
  async getMySubscription(): Promise<UserAISubscription> {
    const response = await this.client.get<{ success: boolean; subscription: UserAISubscription }>(
      '/api/v1/ai/subscriptions/my-subscription'
    );
    return response.data.subscription;
  }

  /**
   * Purchase a subscription
   */
  async purchase(request: SubscriptionPurchaseRequest): Promise<{
    subscription: UserAISubscription;
    transaction: any;
    message: string;
  }> {
    const response = await this.client.post<{
      success: boolean;
      subscription: UserAISubscription;
      transaction: any;
      message: string;
    }>('/api/v1/ai/subscriptions/purchase', request);
    return {
      subscription: response.data.subscription,
      transaction: response.data.transaction,
      message: response.data.message,
    };
  }

  /**
   * Change (upgrade or downgrade) subscription
   */
  async change(request: SubscriptionChangeRequest): Promise<{
    subscription: UserAISubscription;
    message: string;
  }> {
    const response = await this.client.put<{
      success: boolean;
      subscription: UserAISubscription;
      message: string;
    }>('/api/v1/ai/subscriptions/change', request);
    return {
      subscription: response.data.subscription,
      message: response.data.message,
    };
  }

  /**
   * Cancel subscription
   */
  async cancel(reason?: string): Promise<void> {
    await this.client.delete('/api/v1/ai/subscriptions/cancel', {
      data: { reason },
    });
  }

  /**
   * Get AI usage statistics
   */
  async getAiUsage(): Promise<AIUsageResponse> {
    const response = await this.client.get<{ success: boolean } & AIUsageResponse>(
      '/api/v1/ai/subscriptions/ai-usage'
    );
    return {
      subscription: response.data.subscription,
      limits: response.data.limits,
      usage: response.data.usage,
      sixHourUsage: response.data.sixHourUsage,
      usagePercentages: response.data.usagePercentages,
      remainingRequests: response.data.remainingRequests,
      resetTimes: response.data.resetTimes,
      aiToolUsage: response.data.aiToolUsage,
      categoryUsage: response.data.categoryUsage,
    };
  }
}

export default NostraHealthAI;
