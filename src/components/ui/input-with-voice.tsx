import * as React from "react"
import { cn } from "@/lib/utils"
import { SpeechToTextButton } from "@/components/SpeechToTextButton"

export interface InputWithVoiceProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onVoiceTranscription?: (text: string) => void;
}

const InputWithVoice = React.forwardRef<HTMLInputElement, InputWithVoiceProps>(
  ({ className, onVoiceTranscription, value, onChange, type, ...props }, ref) => {
    const handleVoiceTranscription = (transcription: string) => {
      if (onVoiceTranscription) {
        onVoiceTranscription(transcription);
      } else if (onChange) {
        // Append transcription to existing text
        const currentValue = value?.toString() || '';
        const newValue = currentValue ? `${currentValue} ${transcription}` : transcription;
        const syntheticEvent = {
          target: { value: newValue }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-12 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          value={value}
          onChange={onChange}
          {...props}
        />
        <div className="absolute top-1/2 right-2 -translate-y-1/2">
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
InputWithVoice.displayName = "InputWithVoice"

export { InputWithVoice }