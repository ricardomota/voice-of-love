import { useState, useEffect, useCallback } from 'react';
import { Person, Memory } from '@/types/person';
import { FormData, getInitialFormData } from './FormData';

export const useFormData = (person?: Person) => {
  const [formData, setFormData] = useState<FormData>(getInitialFormData);

  useEffect(() => {
    if (person) {
      setFormData({
        name: person.name,
        relationship: person.relationship,
        howTheyCalledYou: person.howTheyCalledYou || "",
        birthYear: person.birthYear?.toString() || "",
        avatar: person.avatar || "",
        memories: person.memories.length > 0 ? person.memories : [{ id: "memory-1", text: "", mediaUrl: "", mediaType: undefined, fileName: "" }],
        personality: person.personality.length > 0 ? person.personality : [""],
        commonPhrases: person.commonPhrases.length > 0 ? person.commonPhrases : [""],
        temperature: person.temperature || 0.7,
        talkingStyle: person.talkingStyle || "",
        humorStyle: person.humorStyle || "",
        emotionalTone: person.emotionalTone || "",
        verbosity: person.verbosity || "",
        values: person.values && person.values.length > 0 ? person.values : [""],
        topics: person.topics && person.topics.length > 0 ? person.topics : [""],
        voiceRecording: null,
        voiceDuration: 0
      });
    }
  }, [person]);

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const addField = useCallback((field: 'memories' | 'personality' | 'commonPhrases' | 'values' | 'topics') => {
    if (field === 'memories') {
      setFormData(prev => ({
        ...prev,
        memories: [...prev.memories, { id: `memory-${Date.now()}`, text: "", mediaUrl: "", mediaType: undefined, fileName: "" }]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], ""]
      }));
    }
  }, []);

  const removeField = useCallback((field: 'memories' | 'personality' | 'commonPhrases' | 'values' | 'topics', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  }, []);

  const updateField = useCallback((field: 'memories' | 'personality' | 'commonPhrases' | 'values' | 'topics', index: number, value: string) => {
    if (field === 'memories') {
      setFormData(prev => ({
        ...prev,
        memories: prev.memories.map((item, i) => i === index ? { ...item, text: value } : item)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].map((item, i) => i === index ? value : item)
      }));
    }
  }, []);

  const updateMemoryMedia = useCallback((index: number, mediaUrl: string, mediaType: string, fileName: string) => {
    setFormData(prev => ({
      ...prev,
      memories: prev.memories.map((memory, i) => 
        i === index 
          ? { ...memory, mediaUrl, mediaType: mediaType as Memory['mediaType'], fileName }
          : memory
      )
    }));
  }, []);

  return {
    formData,
    updateFormData,
    addField,
    removeField,
    updateField,
    updateMemoryMedia
  };
};