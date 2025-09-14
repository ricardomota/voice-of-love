import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Heart, Shield, Users, Brain, Clock } from 'lucide-react';

interface ConsentModalProps {
  open: boolean;
  onConsent: (consents: ConsentFlags) => void;
  onCancel: () => void;
}

export interface ConsentFlags {
  dataUsage: boolean;
  rightToUse: boolean;
  therapeuticPurpose: boolean;
  understandLimitations: boolean;
  privacyAcknowledged: boolean;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({ open, onConsent, onCancel }) => {
  const [consents, setConsents] = useState<ConsentFlags>({
    dataUsage: false,
    rightToUse: false,
    therapeuticPurpose: false,
    understandLimitations: false,
    privacyAcknowledged: false
  });

  const handleConsentChange = (key: keyof ConsentFlags, value: boolean) => {
    setConsents(prev => ({ ...prev, [key]: value }));
  };

  const allConsentsGiven = Object.values(consents).every(Boolean);

  const handleContinue = () => {
    if (allConsentsGiven) {
      onConsent(consents);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Heart className="w-6 h-6 text-primary" />
            Eterna - Consent & Understanding
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Purpose Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              What is Eterna?
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Eterna is a privacy-first conversational clone designed to provide therapeutic comfort and support for families affected by Alzheimer's. 
              By creating an AI that can mirror your loved one's conversational style, we aim to help preserve memories and provide emotional comfort during difficult times.
            </p>
          </div>

          <Separator />

          {/* Key Principles */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Our Core Principles
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span><strong>Therapeutic Support:</strong> Designed for comfort, reminiscence, and emotional healing</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span><strong>Privacy First:</strong> Your data is encrypted, isolated, and never shared</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span><strong>Transparent AI:</strong> Clear indication this is a supportive simulation, not deception</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span><strong>User Control:</strong> Complete ownership of your data with full deletion rights</span>
              </li>
            </ul>
          </div>

          <Separator />

          {/* Required Consents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Required Consents
            </h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="rightToUse"
                  checked={consents.rightToUse}
                  onCheckedChange={(checked) => handleConsentChange('rightToUse', !!checked)}
                />
                <label htmlFor="rightToUse" className="text-sm leading-relaxed cursor-pointer">
                  <strong>Rights & Permissions:</strong> I confirm that I have the legal right and moral authority to use the provided data 
                  (conversations, voice recordings, etc.) to create this AI representation. If the person is living, they have consented to this use. 
                  If deceased, I am an appropriate steward of their digital legacy.
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="therapeuticPurpose"
                  checked={consents.therapeuticPurpose}
                  onCheckedChange={(checked) => handleConsentChange('therapeuticPurpose', !!checked)}
                />
                <label htmlFor="therapeuticPurpose" className="text-sm leading-relaxed cursor-pointer">
                  <strong>Therapeutic Purpose:</strong> I understand that Eterna is designed for therapeutic comfort, personal reminiscence, 
                  and emotional support. I will not use this system to impersonate, deceive others, or for any fraudulent purposes.
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="understandLimitations"
                  checked={consents.understandLimitations}
                  onCheckedChange={(checked) => handleConsentChange('understandLimitations', !!checked)}
                />
                <label htmlFor="understandLimitations" className="text-sm leading-relaxed cursor-pointer">
                  <strong>AI Limitations:</strong> I understand this is an AI simulation based on provided data, not the actual person. 
                  It may not always be accurate and should not be relied upon for medical, legal, or financial advice. 
                  I will seek professional help when needed.
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="dataUsage"
                  checked={consents.dataUsage}
                  onCheckedChange={(checked) => handleConsentChange('dataUsage', !!checked)}
                />
                <label htmlFor="dataUsage" className="text-sm leading-relaxed cursor-pointer">
                  <strong>Data Processing:</strong> I consent to the processing of uploaded data (messages, audio, video) for the purpose of 
                  creating the conversational clone. I understand that sensitive information will be automatically detected and protected.
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacyAcknowledged"
                  checked={consents.privacyAcknowledged}
                  onCheckedChange={(checked) => handleConsentChange('privacyAcknowledged', !!checked)}
                />
                <label htmlFor="privacyAcknowledged" className="text-sm leading-relaxed cursor-pointer">
                  <strong>Privacy & Control:</strong> I acknowledge that my data is encrypted and isolated to my account only. 
                  I can export or permanently delete all data at any time. No data is shared with other users or used for general AI training.
                </label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Time Commitment */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium mb-2">
              <Clock className="w-4 h-4" />
              Time Investment
            </div>
            <p className="text-sm text-muted-foreground">
              Creating a quality conversational clone requires patience. Processing your data (transcription, safety filtering, and indexing) 
              typically takes 15-30 minutes depending on the amount of content. The more authentic data you provide, the better the results.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!allConsentsGiven}
              className="flex-1"
            >
              I Understand & Consent
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};