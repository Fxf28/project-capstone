declare global {
  interface Window {
    // Tambahan untuk Leaflet di window global
    L: typeof import('leaflet');
    
    // File System API untuk reading files in artifacts
    fs: {
      readFile: (path: string, options?: { encoding?: string }) => Promise<string | Uint8Array>;
    };
    
    // Optional garbage collection
    gc?: () => void;
  }
  
  // Extend Navigator untuk device detection
  interface Navigator {
    deviceMemory?: number;
    hardwareConcurrency?: number;
    connection?: {
      effectiveType: string;
      downlink: number;
      rtt: number;
      saveData: boolean;
    };
  }
}

// Extend tensor flow types if needed
declare module '@tensorflow/tfjs' {
  interface Tensor {
    // Add any custom tensor methods if needed
  }
}

// Module declarations for assets
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

// Environment variables
declare module 'process/env' {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    VITE_API_BASE_URL: string;
    VITE_RASA_API_URL: string;
    VITE_CLOUDINARY_CLOUD_NAME: string;
    VITE_CLOUDINARY_UPLOAD_PRESET: string;
  }
}

export {};