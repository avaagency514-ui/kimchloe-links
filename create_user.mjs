import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function main() {
  console.log("Création de l'utilisateur...")
  const email = 'contact@monprojet.com'
  const password = 'Password123!'
  const username = 'admin'

  // 1. Create User
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true
  })
  
  if (authError) {
    if (authError.message.includes('already registered')) {
        console.log("Cet email existe déjà, on essaie un autre.")
    } else {
        console.error("Erreur lors de la création du compte Auth:", authError)
        return
    }
  }
  
  const userId = authData?.user?.id
  
  if (userId) {
    console.log("Utilisateur créé avec succès dans Auth. ID:", userId)
    
    // 2. Insert Profile
    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: userId,
        username: username,
      }
    ])
    
    if (profileError) {
      console.error("Erreur Profile:", profileError)
    } else {
      console.log("Profil ajouté.")
    }

    // 3. Create Default Workspace
    const { data: wsData, error: wsError } = await supabase.from('workspaces').insert([
      { name: 'Mon Workspace Admin', type: 'Espace personnel', icon: 'A' }
    ]).select().single()

    if (!wsError && wsData) {
       await supabase.from('workspace_members').insert([
         { workspace_id: wsData.id, user_id: userId, role: 'Owner' }
       ])
       console.log("Workspace créé.")
    }

    console.log(`\n\nCOMPTE CRÉÉ :`)
    console.log(`Email : ${email}`)
    console.log(`Mot de passe : ${password}`)
  }
}

main()
