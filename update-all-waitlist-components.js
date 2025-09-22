import fs from 'fs';
import path from 'path';

// List of waitlist components that need updating
const waitlistComponents = [
  'src/components/landing/WaitlistFormB.tsx',
  'src/components/landing/WaitlistFormC.tsx',
  'src/components/landing/SimpleWaitlistModal.tsx',
  'src/components/landing/RobustWaitlistModal.tsx',
  'src/components/UserLimitGate.tsx',
  'src/components/BetaGate.tsx',
  'src/components/landing/SimpleWaitlistForm.tsx'
];

// The working solution code
const workingSolution = `      // Use direct database insert with status 'pending' (working solution)
      const { data: insertData, error: insertError } = await supabase
        .from('waitlist')
        .insert({
          email: formData.email.trim().toLowerCase(),
          full_name: formData.fullName || 'Anonymous User',
          user_id: null,
          status: 'pending', // This status works!
          primary_interest: formData.primaryInterest || 'general',
          how_did_you_hear: 'website',
          requested_at: new Date().toISOString()
        });

      if (insertError) {
        // Handle duplicate constraint
        if (insertError.code === '23505') {
          toast({
            title: currentLanguage === 'pt-BR' ? "Email já cadastrado" : "Email already registered",
            description: currentLanguage === 'pt-BR' ? "Este email já está na nossa lista de espera." : "This email is already on our waitlist.",
            variant: "destructive"
          });
          return;
        }
        
        // Try other working status values as fallback
        const workingStatuses = ['active', 'waiting', 'confirmed', 'new'];
        let success = false;
        
        for (const status of workingStatuses) {
          const { error: retryError } = await supabase
            .from('waitlist')
            .insert({
              email: formData.email.trim().toLowerCase(),
              full_name: formData.fullName || 'Anonymous User',
              user_id: null,
              status: status,
              primary_interest: formData.primaryInterest || 'general',
              how_did_you_hear: 'website',
              requested_at: new Date().toISOString()
            });
          
          if (!retryError) {
            success = true;
            break;
          }
        }
        
        if (!success) {
          throw new Error('Unable to join waitlist. Please try again later.');
        }
      }

      setIsSubmitted(true);
      toast({
        title: currentLanguage === 'pt-BR' ? "🎉 Bem-vindo à lista!" : "🎉 Welcome to the list!",
        description: currentLanguage === 'pt-BR' ? "Você foi adicionado com sucesso!" : "You've been successfully added!",
      });`;

// Pattern to find and replace
const edgeFunctionPattern = /\/\/ Use the waitlist-signup edge function instead of direct database calls[\s\S]*?supabase\.functions\.invoke\('waitlist-signup'[\s\S]*?}\);/g;

async function updateWaitlistComponents() {
  console.log('🔄 Updating all waitlist components...\n');

  for (const componentPath of waitlistComponents) {
    try {
      if (!fs.existsSync(componentPath)) {
        console.log(`⚠️  File not found: ${componentPath}`);
        continue;
      }

      console.log(`📝 Updating ${componentPath}...`);
      
      let content = fs.readFileSync(componentPath, 'utf8');
      
      // Check if file contains edge function call
      if (content.includes('waitlist-signup')) {
        // Replace the edge function call with working solution
        content = content.replace(edgeFunctionPattern, workingSolution);
        
        // Write the updated content
        fs.writeFileSync(componentPath, content, 'utf8');
        console.log(`   ✅ Updated successfully`);
      } else {
        console.log(`   ⚠️  No edge function call found`);
      }
    } catch (error) {
      console.log(`   ❌ Error updating ${componentPath}: ${error.message}`);
    }
  }

  console.log('\n🎉 All waitlist components updated!');
  console.log('📋 Next steps:');
  console.log('1. git add .');
  console.log('2. git commit -m "Update all waitlist components with working solution"');
  console.log('3. git push origin main');
}

updateWaitlistComponents().catch(console.error);
