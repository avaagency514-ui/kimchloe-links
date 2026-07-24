import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'contact@monprojet.com',
    password: 'Password123!',
  })

  if (error) {
    console.error("Login failed:", error.message)
  } else {
    console.log("Login successful! User ID:", data.user.id)
  }
}

testLogin()
