import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface ConfirmSignupEmailProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
  language: string
}

const translations = {
  pt: {
    preview: 'Confirme seu cadastro no Eterna',
    title: 'Bem-vindo ao Eterna',
    subtitle: 'Confirme seu cadastro para começar',
    description: 'Clique no botão abaixo para confirmar seu email e ativar sua conta no Eterna.',
    buttonText: 'Confirmar Cadastro',
    alternativeText: 'Ou copie e cole este código temporário:',
    ignoreText: 'Se você não criou uma conta no Eterna, pode ignorar este email com segurança.',
    footer: 'Eterna - Preserve memórias para sempre',
  },
  en: {
    preview: 'Confirm your Eterna signup',
    title: 'Welcome to Eterna',
    subtitle: 'Confirm your signup to get started',
    description: 'Click the button below to confirm your email and activate your Eterna account.',
    buttonText: 'Confirm Signup',
    alternativeText: 'Or copy and paste this temporary code:',
    ignoreText: 'If you didn\'t create an Eterna account, you can safely ignore this email.',
    footer: 'Eterna - Preserve memories forever',
  }
}

export const ConfirmSignupEmail = ({
  token,
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
  language,
}: ConfirmSignupEmailProps) => {
  const t = translations[language as keyof typeof translations] || translations.pt

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>{t.title}</Heading>
            <Text style={subtitle}>{t.subtitle}</Text>
          </Section>
          
          <Section style={content}>
            <Text style={text}>{t.description}</Text>
            
            <Link
              href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
              target="_blank"
              style={button}
            >
              {t.buttonText}
            </Link>
            
            <Text style={alternativeText}>{t.alternativeText}</Text>
            <div style={codeContainer}>
              <code style={code}>{token}</code>
            </div>
            
            <Text style={disclaimerText}>{t.ignoreText}</Text>
          </Section>
          
          <Section style={footer}>
            <Text style={footerText}>{t.footer}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default ConfirmSignupEmail

const main = {
  backgroundColor: '#0a0a0b',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
}

const header = {
  textAlign: 'center' as const,
  padding: '40px 20px',
  background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
  borderRadius: '12px 12px 0 0',
}

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0 0 8px 0',
  lineHeight: '1.2',
}

const subtitle = {
  color: '#e2e8f0',
  fontSize: '18px',
  fontWeight: '400',
  margin: '0',
  lineHeight: '1.4',
}

const content = {
  padding: '40px 20px',
  backgroundColor: '#1a1a1a',
  borderRadius: '0 0 12px 12px',
  border: '1px solid #2d2d2d',
  borderTop: 'none',
}

const text = {
  color: '#e2e8f0',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: '#8B5CF6',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '16px 32px',
  margin: '24px auto',
  maxWidth: '200px',
  transition: 'background-color 0.2s ease',
}

const alternativeText = {
  color: '#94a3b8',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '32px 0 16px 0',
  textAlign: 'center' as const,
}

const codeContainer = {
  textAlign: 'center' as const,
  margin: '16px 0 32px 0',
}

const code = {
  display: 'inline-block',
  padding: '16px 24px',
  backgroundColor: '#2d2d2d',
  borderRadius: '8px',
  border: '1px solid #3d3d3d',
  color: '#e2e8f0',
  fontSize: '18px',
  fontWeight: '600',
  fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  letterSpacing: '2px',
}

const disclaimerText = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '24px 0 0 0',
  textAlign: 'center' as const,
}

const footer = {
  textAlign: 'center' as const,
  padding: '20px',
}

const footerText = {
  color: '#64748b',
  fontSize: '12px',
  margin: '0',
}