import React from 'react';
import { Button } from '@/components/ui/button';
import { InputWithVoice } from '@/components/ui/input-with-voice';
import { TextareaWithVoice } from '@/components/ui/textarea-with-voice';
import { Plus, X } from 'lucide-react';

interface ArrayFieldProps {
  values: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string) => void;
  placeholder: string;
  label: string;
  addText?: string;
  isTextarea?: boolean;
  maxItems?: number;
}

export const ArrayField: React.FC<ArrayFieldProps> = ({
  values,
  onAdd,
  onRemove,
  onUpdate,
  placeholder,
  label,
  addText = "Adicionar",
  isTextarea = false,
  maxItems = 10
}) => {
  const InputComponent = isTextarea ? TextareaWithVoice : InputWithVoice;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">{label}</h3>
        {values.length < maxItems && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={onAdd}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {addText}
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <InputComponent
              value={value}
              onChange={(e) => onUpdate(index, e.target.value)}
              placeholder={`${placeholder} ${index + 1}`}
              className="flex-1"
              {...(isTextarea && { rows: 3 })}
            />
            {values.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                className="mt-1"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};