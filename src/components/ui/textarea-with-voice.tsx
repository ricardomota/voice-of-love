import * as React from "react"
import { cn } from "@/lib/utils"
import { SpeechToTextButton } from "@/components/SpeechToTextButton"

export interface TextareaWithVoiceProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onVoiceTranscription?: (text: string) => void;
}

const TextareaWithVoice = React.forwardRef<HTMLTextAreaElement, TextareaWithVoiceProps>(
  ({ className, onVoiceTranscription, value, onChange, ...props }, ref) => {
    const handleVoiceTranscription = (transcription: string) => {
      if (onVoiceTranscription) {
        onVoiceTranscription(transcription);
      } else if (onChange) {
        // Append transcription to existing text
        const currentValue = value?.toString() || '';
        const newValue = currentValue ? `${currentValue} ${transcription}` : transcription;
        const syntheticEvent = {
          target: { value: newValue }
        } as React.ChangeEvent<HTMLTextAreaElement>;
        onChange(syntheticEvent);
      }
    };

    return (
      <div className="relative">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 pr-12 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          value={value}
          onChange={onChange}
          {...props}
        />
        <div className="absolute bottom-2 right-2">
          <SpeechToTextButton 
            variant="compact"
            onTranscription={handleVoiceTranscription}
            disabled={props.disabled}
          />
        </div>
      </div>
    )
  }
)
TextareaWithVoice.displayName = "TextareaWithVoice"

export { TextareaWithVoice }