import * as tf from '@tensorflow/tfjs';

interface PredictionResult {
  className: string;
  confidence: number;
}

class TensorFlowService {
  private model: tf.GraphModel | null = null;
  private classNames: string[] = [
    'Cardboard',
    'Food Organics', 
    'Glass',
    'Metal',
    'Miscellaneous Trash',
    'Paper',
    'Plastic',
    'Textile Trash',
    'Vegetation'
  ];
  private isLoading = false;
  private isLoaded = false;

  async loadModel(): Promise<void> {
    if (this.isLoaded || this.isLoading) return;
    
    this.isLoading = true;
    try {
      console.log('Loading TensorFlow.js model...');
      this.model = await tf.loadGraphModel('/models/model.json');
      this.isLoaded = true;
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading model:', error);
      throw new Error('Failed to load classification model');
    } finally {
      this.isLoading = false;
    }
  }

  async predict(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): Promise<PredictionResult> {
    if (!this.model) {
      await this.loadModel();
    }

    if (!this.model) {
      throw new Error('Model not loaded');
    }

    try {
      // Preprocess image
      const tensor = tf.browser.fromPixels(imageElement)
        .resizeNearestNeighbor([224, 224]) // Resize to model input size
        .toFloat()
        .div(255.0) // Normalize to [0, 1]
        .expandDims(0); // Add batch dimension

      // Make prediction
      const predictions = await this.model.predict(tensor) as tf.Tensor;
      const probabilities = await predictions.data();
      
      // Get the class with highest probability
      const maxProbIndex = probabilities.indexOf(Math.max(...probabilities));
      const confidence = probabilities[maxProbIndex];
      const className = this.classNames[maxProbIndex];

      // Clean up tensors
      tensor.dispose();
      predictions.dispose();

      return {
        className,
        confidence: confidence * 100 // Convert to percentage
      };
    } catch (error) {
      console.error('Error during prediction:', error);
      throw new Error('Failed to classify image');
    }
  }

  async predictFromFile(file: File): Promise<PredictionResult> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = async () => {
        try {
          const result = await this.predict(img);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  async predictFromBlob(blob: Blob): Promise<PredictionResult> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = async () => {
        try {
          const result = await this.predict(img);
          URL.revokeObjectURL(img.src); // Clean up
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to load image'));
      };
      img.src = URL.createObjectURL(blob);
    });
  }

  isModelLoaded(): boolean {
    return this.isLoaded;
  }

  getClassNames(): string[] {
    return [...this.classNames];
  }
}

export const tensorflowService = new TensorFlowService();