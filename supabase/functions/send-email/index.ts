import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'https://esm.sh/resend@2.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

// Email translations
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

function generateEmailHTML(params: {
  supabase_url: string;
  token: string;
  token_hash: string;
  redirect_to: string;
  email_action_type: string;
  language: string;
}) {
  const { supabase_url, token, token_hash, redirect_to, email_action_type, language } = params;
  const t = translations[language as keyof typeof translations] || translations.pt;
  const confirmUrl = `${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.preview}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;">
  <div style="margin: 0 auto; padding: 20px 0 48px; max-width: 600px;">
    
    <!-- Header -->
    <div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%); border-radius: 12px 12px 0 0;">
      <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0 0 8px 0; line-height: 1.2;">${t.title}</h1>
      <p style="color: #e2e8f0; font-size: 18px; font-weight: 400; margin: 0; line-height: 1.4;">${t.subtitle}</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 20px; background-color: #1a1a1a; border-radius: 0 0 12px 12px; border: 1px solid #2d2d2d; border-top: none;">
      <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">${t.description}</p>
      
      <!-- Confirm Button -->
      <div style="text-align: center; margin: 24px 0;">
        <a href="${confirmUrl}" target="_blank" style="background-color: #8B5CF6; border-radius: 8px; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; display: inline-block; padding: 16px 32px; margin: 0 auto; transition: background-color 0.2s ease;">${t.buttonText}</a>
      </div>
      
      <!-- Alternative Code -->
      <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 32px 0 16px 0; text-align: center;">${t.alternativeText}</p>
      <div style="text-align: center; margin: 16px 0 32px 0;">
        <code style="display: inline-block; padding: 16px 24px; background-color: #2d2d2d; border-radius: 8px; border: 1px solid #3d3d3d; color: #e2e8f0; font-size: 18px; font-weight: 600; font-family: Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; letter-spacing: 2px;">${token}</code>
      </div>
      
      <!-- Disclaimer -->
      <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 24px 0 0 0; text-align: center;">${t.ignoreText}</p>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 20px;">
      <p style="color: #64748b; font-size: 12px; margin: 0;">${t.footer}</p>
    </div>
    
  </div>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('not allowed', { status: 400 })
  }

  const payload = await req.text()
  const headers = Object.fromEntries(req.headers)
  const wh = new Webhook(hookSecret)
  
  try {
    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = wh.verify(payload, headers) as {
      user: {
        email: string
        raw_user_meta_data?: {
          language?: string
        }
      }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
        site_url: string
      }
    }

    console.log('Email webhook received:', { 
      email: user.email, 
      action: email_action_type,
      language: user.raw_user_meta_data?.language 
    })

    // Get user's language from metadata, default to 'pt'
    const language = user.raw_user_meta_data?.language || 'pt'

    const html = generateEmailHTML({
      supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
      token,
      token_hash,
      redirect_to,
      email_action_type,
      language,
    })

    const { error } = await resend.emails.send({
      from: 'Eterna <contact@eterna.chat>',
      to: [user.email],
      subject: language === 'en' ? 'Confirm Your Signup - Eterna' : 'Confirme Seu Cadastro - Eterna',
      html,
    })

    if (error) {
      throw error
    }

    console.log('Email sent successfully to:', user.email)
  } catch (error: any) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({
        error: {
          http_code: error.code,
          message: error.message,
        },
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  return new Response(JSON.stringify({}), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})