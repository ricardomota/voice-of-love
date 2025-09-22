import { useMemo } from 'react';
import { FormData } from '@/components/PersonForm/FormData';

export const useFormValidation = (formData: FormData) => {
  const validation = useMemo(() => {
    const canProceed = (step: number): boolean => {
      switch (step) {
        case 1: return Boolean(formData.name.trim());
        case 2: return Boolean(formData.relationship.trim());
        case 3: return true; // How they called you is optional
        case 4: return formData.memories.some(m => m.text.trim() || m.mediaUrl);
        case 5: return formData.personality.some(p => p.trim());
        case 6: return Boolean(formData.talkingStyle.trim());
        case 7: return Boolean(formData.humorStyle.trim());
        case 8: return Boolean(formData.emotionalTone.trim());
        case 9: return Boolean(formData.verbosity.trim());
        case 10: return formData.values.some(v => v.trim());
        case 11: return formData.topics.some(t => t.trim());
        case 12: return true; // Temperature always has a value
        case 13: return true; // Voice recording is optional
        case 14: return formData.commonPhrases.some(p => p.trim());
        default: return true;
      }
    };

    const isFormValid = () => {
      return Boolean(
        formData.name.trim() &&
        formData.relationship.trim() &&
        formData.memories.some(m => m.text.trim() || m.mediaUrl) &&
        formData.personality.some(p => p.trim()) &&
        formData.talkingStyle.trim() &&
        formData.humorStyle.trim() &&
        formData.emotionalTone.trim() &&
        formData.verbosity.trim() &&
        formData.values.some(v => v.trim()) &&
        formData.topics.some(t => t.trim()) &&
        formData.commonPhrases.some(p => p.trim())
      );
    };

    return {
      canProceed,
      isFormValid: isFormValid()
    };
  }, [formData]);

  return validation;
};