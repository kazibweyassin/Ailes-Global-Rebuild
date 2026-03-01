/**
 * AI Response Cache System
 * Caches common scholarship questions and answers to reduce API calls
 * Pure in-memory implementation — safe for Vercel / serverless environments
 */

import { createHash } from 'crypto';

interface CacheEntry {
  key: string;
  response: string;
  metadata?: {
    scholarshipId?: string;
    scholarshipName?: string;
    questionType?: string;
    createdAt: string;
    expiresAt?: string;
  };
}

class AICache {
  private memoryCache: Map<string, CacheEntry> = new Map();
  private maxMemoryEntries = 1000; // Limit memory cache size

  constructor() {
    // Pure in-memory cache — no filesystem I/O required
  }

  /**
   * Generate cache key from message and context
   */
  private generateKey(message: string, context?: any): string {
    const normalizedMessage = message.toLowerCase().trim();
    
    // Extract key context fields
    const contextHash = context ? {
      scholarshipId: context.scholarshipId,
      scholarshipName: context.scholarshipName,
      questionType: this.detectQuestionType(normalizedMessage),
    } : {};
    
    const keyString = JSON.stringify({ message: normalizedMessage, context: contextHash });
    return createHash('sha256').update(keyString).digest('hex');
  }

  /**
   * Detect question type from message
   */
  private detectQuestionType(message: string): string {
    const lower = message.toLowerCase();
    
    if (/how to apply|application process|steps|procedure/i.test(message)) {
      return 'application_steps';
    }
    if (/eligibility|requirements|qualify|need|must have/i.test(message)) {
      return 'eligibility';
    }
    if (/deadline|when|due date|close/i.test(message)) {
      return 'deadline';
    }
    if (/amount|funding|money|cost|cover|tuition/i.test(message)) {
      return 'funding';
    }
    if (/essay|personal statement|sop|motivation letter|document/i.test(message)) {
      return 'documents';
    }
    if (/tips|advice|recommendation|suggest/i.test(message)) {
      return 'tips';
    }
    if (/about|what is|tell me about|information/i.test(message)) {
      return 'general_info';
    }
    
    return 'general';
  }

  /**
   * Get cached response
   */
  get(message: string, context?: any): string | null {
    const key = this.generateKey(message, context);
    
    // Check memory cache
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry) {
      // Check expiration
      if (memoryEntry.metadata?.expiresAt) {
        const expiresAt = new Date(memoryEntry.metadata.expiresAt);
        if (expiresAt < new Date()) {
          this.memoryCache.delete(key);
          return null;
        }
      }
      return memoryEntry.response;
    }
    
    return null;
  }

  /**
   * Set cached response
   */
  set(message: string, response: string, context?: any, ttlHours: number = 24 * 7): void {
    const key = this.generateKey(message, context);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + ttlHours);
    
    const entry: CacheEntry = {
      key,
      response,
      metadata: {
        scholarshipId: context?.scholarshipId,
        scholarshipName: context?.scholarshipName,
        questionType: this.detectQuestionType(message),
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
      },
    };
    
    // Store in memory cache
    if (this.memoryCache.size >= this.maxMemoryEntries) {
      // Remove oldest entry (simple FIFO)
      const firstKey = this.memoryCache.keys().next().value;
      if (firstKey) {
        this.memoryCache.delete(firstKey);
      }
    }
    this.memoryCache.set(key, entry);
  }

  /**
   * Check if a response exists in cache
   */
  has(message: string, context?: any): boolean {
    return this.get(message, context) !== null;
  }

  /**
   * Clear cache (memory and disk)
   */
  clear(): void {
    this.memoryCache.clear();
  }

  /**
   * Invalidate cache entries matching criteria
   */
  invalidate(criteria: {
    scholarshipId?: string;
    scholarshipName?: string;
    questionType?: string;
  }): number {
    let invalidated = 0;
    const keysToDelete: string[] = [];

    this.memoryCache.forEach((entry, key) => {
      const metadata: any = entry.metadata || {};
      let shouldInvalidate = false;

      if (criteria.scholarshipId && metadata.scholarshipId === criteria.scholarshipId) {
        shouldInvalidate = true;
      }
      if (criteria.scholarshipName && metadata.scholarshipName === criteria.scholarshipName) {
        shouldInvalidate = true;
      }
      if (criteria.questionType && metadata.questionType === criteria.questionType) {
        shouldInvalidate = true;
      }

      if (shouldInvalidate) {
        keysToDelete.push(key);
        invalidated++;
      }
    });

    keysToDelete.forEach((key) => this.memoryCache.delete(key));
    return invalidated;
  }

  /**
   * Clean expired entries
   */
  cleanExpired(): number {
    let cleaned = 0;
    const now = new Date();
    const keysToDelete: string[] = [];

    this.memoryCache.forEach((entry, key) => {
      if (entry.metadata?.expiresAt) {
        const expiresAt = new Date(entry.metadata.expiresAt);
        if (expiresAt < now) {
          keysToDelete.push(key);
          cleaned++;
        }
      }
    });

    keysToDelete.forEach((key) => this.memoryCache.delete(key));
    return cleaned;
  }

  /**
   * Get cache statistics
   */
  getStats(): { memoryEntries: number; questionTypes: Record<string, number> } {
    const questionTypes: Record<string, number> = {};
    
    this.memoryCache.forEach((entry) => {
      const type = entry.metadata?.questionType || 'unknown';
      questionTypes[type] = (questionTypes[type] || 0) + 1;
    });
    
    return {
      memoryEntries: this.memoryCache.size,
      questionTypes,
    };
  }
}

// Singleton instance
let cacheInstance: AICache | null = null;

export function getAICache(): AICache {
  if (!cacheInstance) {
    cacheInstance = new AICache();
  }
  return cacheInstance;
}

export type { CacheEntry };

