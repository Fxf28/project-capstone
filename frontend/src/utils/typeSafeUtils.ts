// Type guard untuk check if value is string
export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

// Type guard untuk check if value is number
export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

// Type guard untuk check if value is Error
export const isError = (value: unknown): value is Error => {
  return value instanceof Error;
};

// Safe string extractor dari unknown error
export const extractErrorMessage = (error: unknown): string => {
  if (isError(error)) {
    return error.message;
  }
  
  if (isString(error)) {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as any).message;
    if (isString(message)) {
      return message;
    }
  }
  
  return 'Unknown error occurred';
};

// Safe number parser
export const safeParseFloat = (value: unknown): number | null => {
  if (isNumber(value)) {
    return value;
  }
  
  if (isString(value)) {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  }
  
  return null;
};

// Safe integer parser
export const safeParseInt = (value: unknown): number | null => {
  if (isNumber(value)) {
    return Math.floor(value);
  }
  
  if (isString(value)) {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? null : parsed;
  }
  
  return null;
};

// Safe URL validator
export const isValidUrl = (value: unknown): value is string => {
  if (!isString(value)) {
    return false;
  }
  
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

// Safe email validator
export const isValidEmail = (value: unknown): value is string => {
  if (!isString(value)) {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

// Safe date parser
export const safeParseDateString = (value: unknown): Date | null => {
  if (value instanceof Date) {
    return value;
  }
  
  if (isString(value)) {
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  
  return null;
};

// Safe array checker
export const isArray = <T>(value: unknown): value is T[] => {
  return Array.isArray(value);
};

// Safe object checker
export const isObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

// Safe property accessor
export const getProperty = <T>(
  obj: unknown, 
  key: string, 
  defaultValue: T
): T => {
  if (isObject(obj) && key in obj) {
    const value = obj[key];
    return value as T ?? defaultValue;
  }
  return defaultValue;
};

// Safe array accessor
export const getArrayItem = <T>(
  arr: unknown[], 
  index: number, 
  defaultValue: T
): T => {
  if (isArray(arr) && index >= 0 && index < arr.length) {
    return (arr[index] as T) ?? defaultValue;
  }
  return defaultValue;
};

// Safe confidence validator untuk ML predictions
export const isValidConfidence = (value: unknown): value is number => {
  const num = safeParseFloat(value);
  return num !== null && num >= 0 && num <= 100;
};

// Safe coordinate validator untuk maps
export const isValidCoordinate = (lat: unknown, lng: unknown): boolean => {
  const latitude = safeParseFloat(lat);
  const longitude = safeParseFloat(lng);
  
  return (
    latitude !== null && 
    longitude !== null && 
    latitude >= -90 && 
    latitude <= 90 && 
    longitude >= -180 && 
    longitude <= 180
  );
};

// Safe file validator
export const isValidImageFile = (file: unknown): file is File => {
  return (
    file instanceof File && 
    file.type.startsWith('image/') &&
    file.size > 0 &&
    file.size <= 10 * 1024 * 1024 // 10MB max
  );
};

// Safe classification result validator
export const isValidClassificationResult = (result: unknown): result is {
  class: string;
  confidence: number;
} => {
  return (
    isObject(result) &&
    isString(getProperty(result, 'class', '')) &&
    isValidConfidence(getProperty(result, 'confidence', 0))
  );
};

// Constants dengan type safety
export const WASTE_TYPES = [
  'Cardboard',
  'Food Organics', 
  'Glass',
  'Metal',
  'Miscellaneous Trash',
  'Paper',
  'Plastic',
  'Textile Trash',
  'Vegetation'
] as const;

export type WasteType = typeof WASTE_TYPES[number];

export const isValidWasteType = (value: unknown): value is WasteType => {
  return isString(value) && (WASTE_TYPES as readonly string[]).includes(value);
};

// Memory size utilities
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const bytesToMB = (bytes: number): number => {
  return bytes / (1024 * 1024);
};

// Async operation with timeout
export const withTimeout = <T>(
  promise: Promise<T>, 
  timeoutMs: number,
  timeoutMessage = 'Operation timed out'
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
    )
  ]);
};

// Retry operation with exponential backoff
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: unknown) {
      lastError = new Error(extractErrorMessage(error));
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

// Development helpers
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

// Browser capability checks
export const checkBrowserCapabilities = () => {
  return {
    webgl: (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
      } catch {
        return false;
      }
    })(),
    
    serviceWorker: 'serviceWorker' in navigator,
    
    geolocation: 'geolocation' in navigator,
    
    fileApi: 'File' in window && 'FileReader' in window,
    
    localStorage: (() => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch {
        return false;
      }
    })(),
    
    indexedDB: 'indexedDB' in window,
    
    camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices
  };
};