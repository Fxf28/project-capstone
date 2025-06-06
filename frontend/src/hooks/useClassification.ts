import { useState } from "react";
import { tensorflowService } from "../services/tensorflow";
import { classificationAPI, uploadToCloudinary } from "../services/api";
import { toast } from "react-hot-toast";
import type { ClassificationResult } from "../types";

export const useClassification = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);

  const classifyImage = async (imageSource: File | Blob, method: "upload" | "camera", saveToCloud = false): Promise<ClassificationResult | null> => {
    setLoading(true);
    try {
      if (!tensorflowService.isModelLoaded()) {
        toast.loading("Loading AI model...", { id: "model-loading" });
        await tensorflowService.loadModel();
        toast.dismiss("model-loading");
      }

      const prediction = await tensorflowService.predictFromBlob(imageSource instanceof File ? imageSource : imageSource);

      let imageUrl = "";
      if (saveToCloud) {
        toast.loading("Uploading image...", { id: "upload" });
        const file = imageSource instanceof File ? imageSource : new File([imageSource], "camera-capture.jpg");
        imageUrl = await uploadToCloudinary(file);
        toast.dismiss("upload");
      }

      const classificationResult: ClassificationResult = {
        imageUrl,
        classificationResult: prediction.className,
        confidence: prediction.confidence,
        top5: prediction.top5,
        method,
      };

      if (saveToCloud) {
        await classificationAPI.saveResult(classificationResult);
        toast.success("Classification saved!");
      }

      setResult(classificationResult);
      return classificationResult;
    } catch (error) {
      console.error("Classification error:", error);
      toast.error("Failed to classify image");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    classifyImage,
    loading,
    result,
    setResult,
  };
};
