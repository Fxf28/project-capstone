import * as tf from '@tensorflow/tfjs';

export class TensorFlowOptimizer {
  private static instance: TensorFlowOptimizer;
  private isInitialized = false;
  private memoryMonitorInterval: NodeJS.Timeout | null = null;

  static getInstance(): TensorFlowOptimizer {
    if (!TensorFlowOptimizer.instance) {
      TensorFlowOptimizer.instance = new TensorFlowOptimizer();
    }
    return TensorFlowOptimizer.instance;
  }

  async initializeOptimized(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🔧 Optimizing TensorFlow.js configuration...');

      // Configure memory management
      tf.env().set('WEBGL_DELETE_TEXTURE_THRESHOLD', 0);
      tf.env().set('WEBGL_FLUSH_THRESHOLD', -1);
      
      // Optimize for mobile devices
      tf.env().set('WEBGL_FORCE_F16_TEXTURES', false);
      tf.env().set('WEBGL_RENDER_FLOAT32_CAPABLE', true);
      tf.env().set('WEBGL_PACK', true);
      
      // Reduce memory usage
      tf.env().set('WEBGL_MAX_TEXTURE_SIZE', 4096);
      tf.env().set('WEBGL_SIZE_UPLOAD_UNIFORM', 4);
      
      // CPU fallback optimization
      tf.env().set('CPU_HANDOFF_SIZE_THRESHOLD', 256);
      
      // Set backend with intelligent fallback
      await this.setOptimalBackend();
      
      // Configure memory management
      this.setupMemoryManagement();
      
      this.isInitialized = true;
      console.log('✅ TensorFlow.js optimization completed');
      
    } catch (error: unknown) {
      console.error('❌ TensorFlow.js optimization failed:', error);
      throw error;
    }
  }

  private async setOptimalBackend(): Promise<void> {
    const backends = ['webgl', 'cpu'];
    
    for (const backend of backends) {
      try {
        console.log(`🧪 Testing ${backend} backend...`);
        
        await tf.setBackend(backend);
        await tf.ready();
        
        // Test with simple operation
        const test = tf.tensor2d([[1, 2], [3, 4]]);
        const result = test.matMul(test);
        await result.data();
        
        test.dispose();
        result.dispose();
        
        console.log(`✅ ${backend} backend is working`);
        return;
        
      } catch (error: unknown) {
        console.warn(`⚠️ ${backend} backend failed:`, error);
        continue;
      }
    }
    
    throw new Error('No suitable backend available');
  }

  private setupMemoryManagement(): void {
    // Clear existing interval if any
    if (this.memoryMonitorInterval) {
      clearInterval(this.memoryMonitorInterval);
    }

    // Monitor memory usage
    this.memoryMonitorInterval = setInterval(() => {
      try {
        const memInfo = tf.memory();
        
        // Log memory usage if high
        if (memInfo.numTensors > 100) {
          console.warn('🔴 High tensor count:', memInfo.numTensors);
        }
        
        if (memInfo.numBytes > 50 * 1024 * 1024) { // 50MB
          console.warn('🔴 High memory usage:', Math.round(memInfo.numBytes / 1024 / 1024) + 'MB');
        }
      } catch (error: unknown) {
        console.error('❌ Memory monitoring error:', error);
      }
    }, 30000); // Check every 30 seconds

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });

    // Handle visibility change (mobile optimization)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseOperations();
      } else {
        this.resumeOperations();
      }
    });
  }

  cleanup(): void {
    try {
      // Clear memory monitoring interval
      if (this.memoryMonitorInterval) {
        clearInterval(this.memoryMonitorInterval);
        this.memoryMonitorInterval = null;
      }

      // Dispose TensorFlow variables
      tf.disposeVariables();
      
      console.log('🧹 TensorFlow.js cleanup completed');
    } catch (error: unknown) {
      console.error('❌ Cleanup error:', error);
    }
  }

  private pauseOperations(): void {
    // Pause non-critical operations when app is in background
    console.log('⏸️ Pausing TensorFlow.js operations');
    
    // Stop memory monitoring when in background
    if (this.memoryMonitorInterval) {
      clearInterval(this.memoryMonitorInterval);
      this.memoryMonitorInterval = null;
    }
  }

  private resumeOperations(): void {
    // Resume operations when app becomes visible
    console.log('▶️ Resuming TensorFlow.js operations');
    
    // Restart memory monitoring when app becomes visible
    if (this.isInitialized && !this.memoryMonitorInterval) {
      this.setupMemoryManagement();
    }
  }

  getMemoryInfo(): tf.MemoryInfo {
    try {
      return tf.memory();
    } catch (error: unknown) {
      console.error('❌ Error getting memory info:', error);
      // Return default memory info if error occurs
      return {
        numTensors: 0,
        numDataBuffers: 0,
        numBytes: 0,
        unreliable: true,
        reasons: ['Error occurred while getting memory info']
      };
    }
  }

  // Check if TensorFlow is ready
  isReady(): boolean {
    try {
      return this.isInitialized && tf.getBackend() !== null;
    } catch (error: unknown) {
      console.error('❌ Error checking TensorFlow readiness:', error);
      return false;
    }
  }

  // Get backend information
  getBackendInfo(): { backend: string; ready: boolean } {
    try {
      return {
        backend: tf.getBackend() || 'none',
        ready: this.isReady()
      };
    } catch (error: unknown) {
      console.error('❌ Error getting backend info:', error);
      return {
        backend: 'error',
        ready: false
      };
    }
  }

  // Error recovery methods
  async recoverFromContextLoss(): Promise<void> {
    try {
      console.log('🔄 Recovering from WebGL context loss...');
      
      // Clean up current state
      this.cleanup();
      
      // Reset initialization flag
      this.isInitialized = false;
      
      // Wait before reinitializing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reinitialize
      await this.initializeOptimized();
      
      console.log('✅ Recovery completed');
      
    } catch (error: unknown) {
      console.error('❌ Recovery failed:', error);
      throw error;
    }
  }

  async handleLowMemory(): Promise<void> {
    try {
      console.log('🧹 Handling low memory situation...');
      
      // Force garbage collection if available
      if ('gc' in window && typeof (window as any).gc === 'function') {
        (window as any).gc();
      }
      
      // Dispose unused tensors
      tf.disposeVariables();
      
      // Clear browser cache if possible
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          );
        } catch (cacheError: unknown) {
          console.warn('⚠️ Cache cleanup failed:', cacheError);
        }
      }
      
      console.log('✅ Low memory handling completed');
      
    } catch (error: unknown) {
      console.error('❌ Low memory handling failed:', error);
    }
  }

  // Force cleanup and reset
  async forceReset(): Promise<void> {
    try {
      console.log('🔄 Force resetting TensorFlow.js...');
      
      this.cleanup();
      this.isInitialized = false;
      
      // Wait a bit longer for cleanup
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reinitialize
      await this.initializeOptimized();
      
      console.log('✅ Force reset completed');
    } catch (error: unknown) {
      console.error('❌ Force reset failed:', error);
      throw error;
    }
  }

  // Get system capabilities
  getSystemCapabilities(): {
    webglSupported: boolean;
    hardwareConcurrency: number;
    deviceMemory?: number;
    maxTextureSize?: number;
  } {
    try {
      // Check WebGL support
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      const webglSupported = !!gl;
      
      let maxTextureSize: number | undefined;
      if (gl) {
        maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      }

      return {
        webglSupported,
        hardwareConcurrency: navigator.hardwareConcurrency || 1,
        deviceMemory: (navigator as any).deviceMemory,
        maxTextureSize
      };
    } catch (error: unknown) {
      console.error('❌ Error getting system capabilities:', error);
      return {
        webglSupported: false,
        hardwareConcurrency: 1
      };
    }
  }
}

// Utility functions for error handling
export const handleTensorFlowError = async (error: unknown): Promise<string> => {
  const optimizer = TensorFlowOptimizer.getInstance();
  
  // Type guard to check if error is an Error object
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    
    if (errorMessage.includes('context lost') || errorMessage.includes('context_lost')) {
      try {
        await optimizer.recoverFromContextLoss();
        return 'WebGL context recovered. Please try again.';
      } catch (recoveryError: unknown) {
        console.error('❌ Context recovery failed:', recoveryError);
        return 'WebGL context lost and recovery failed. Please refresh the page.';
      }
    }
    
    if (errorMessage.includes('out of memory') || errorMessage.includes('oom')) {
      await optimizer.handleLowMemory();
      return 'Memory cleaned up. Please try with a smaller image.';
    }
    
    if (errorMessage.includes('shader') || errorMessage.includes('link') || errorMessage.includes('vertex')) {
      return 'Graphics processing error. Please try refreshing the page or use a different browser.';
    }
    
    if (errorMessage.includes('backend') || errorMessage.includes('not ready')) {
      try {
        await optimizer.forceReset();
        return 'TensorFlow.js reinitialized. Please try again.';
      } catch (resetError: unknown) {
        console.error('❌ Reset failed:', resetError);
        return 'Backend initialization failed. Please refresh the page.';
      }
    }
    
    return error.message || 'Unknown TensorFlow.js error occurred.';
  }
  
  // Handle non-Error objects
  if (typeof error === 'string') {
    return error;
  }
  
  // Handle null/undefined
  if (error == null) {
    return 'Unknown error occurred (null/undefined).';
  }
  
  // Try to extract message from object
  if (typeof error === 'object' && 'message' in error) {
    return String((error as any).message);
  }
  
  return 'An unknown error occurred during TensorFlow.js operation.';
};

// Additional utility functions
export const checkTensorFlowSupport = (): {
  supported: boolean;
  webgl: boolean;
  cpu: boolean;
  issues: string[];
} => {
  const issues: string[] = [];
  
  // Check basic TensorFlow support
  if (typeof tf === 'undefined') {
    issues.push('TensorFlow.js not loaded');
    return { supported: false, webgl: false, cpu: true, issues };
  }
  
  // Check WebGL support
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  const webglSupported = !!gl;
  
  if (!webglSupported) {
    issues.push('WebGL not supported - will use CPU backend');
  }
  
  // Check if running in secure context (required for some features)
  if (!window.isSecureContext) {
    issues.push('Insecure context - some features may not work');
  }
  
  return {
    supported: true,
    webgl: webglSupported,
    cpu: true,
    issues
  };
};

// Export singleton instance
export const tensorflowOptimizer = TensorFlowOptimizer.getInstance();