import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY


let supabase = null

// Helper to validate JWT format (header.payload.signature)
const isJWT = (str) => typeof str === 'string' && str.split('.').length === 3

if (typeof url === 'string' && /^https?:\/\//.test(url) && typeof key === 'string' && key) {
  if (!isJWT(key)) {
    console.error('CRITICAL: Supabase Key is not a valid JWT. Database operations will fail. Ensure VITE_SUPABASE_ANON_KEY starts with "eyJ..."')
  }
  
  // Use sessionStorage so the session is cleared when the browser/tab is closed
  supabase = createClient(url, key, {
    auth: {
      storage: window.sessionStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  })
} else {
  console.error('CRITICAL: Supabase URL or Key is missing from environment variables.')
}

export { supabase }

const CONFIG_ERROR = { 
  data: null, 
  error: { 
    message: 'Supabase not configured correctly. Check if VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (JWT format) are set in your .env file.' 
  } 
}

export const resendConfirmationEmail = async (email) => {
  if (!supabase) return CONFIG_ERROR
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email: email
  })
  return { data, error }
}

export const signUp = async (email, password, fullName) => {
  if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  })
  return { data, error }
}

export const signIn = async (email, password) => {
  if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export const signOut = async () => {
  if (!supabase) return { error: null }
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const resetPassword = async (email) => {
  if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })
  return { data, error }
}

export const updatePassword = async (newPassword) => {
  if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  })
  return { data, error }
}

export const getCurrentUser = async () => {
  if (!supabase) return null
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getProfile = async (userId) => {
  if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export const updateProfile = async (userId, profile) => {
  if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
  const { data, error } = await supabase
    .from('user_profiles')
    .update(profile)
    .eq('id', userId)
  return { data, error }
}

export const getApplications = async (userId) => {
  if (!supabase) return { data: [], error: null }
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const createApplication = async (application) => {
  if (!supabase) return { data: [], error: { message: 'Supabase not configured' } }
  const { data, error } = await supabase
    .from('applications')
    .insert([application])
    .select()
  return { data, error }
}

export const uploadDocument = async (userId, file, folder = 'documents') => {
  if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
  const fileName = `${userId}/${folder}/${Date.now()}_${file.name}`
  const { data, error } = await supabase.storage
    .from('user-documents')
    .upload(fileName, file)
  return { data, error }
}

export const getDocuments = async (userId) => {
  if (!supabase) return { data: [], error: null }
  const { data, error } = await supabase.storage
      .from('user-documents')
    .list(`${userId}/documents`)
  return { data, error }
}

export const submitConsultation = async (formData) => {
  if (!supabase) return { data: [], error: { message: 'Supabase not configured' } }
  const { data, error } = await supabase
    .from('consultations')
    .insert([formData])
    .select()
  return { data, error }
}

export const getVisaPrograms = async (filters = {}) => {
  if (!supabase) return { data: [], error: null }
  let query = supabase.from('visa_programs').select('*')
  if (filters.country) query = query.eq('country', filters.country)
  if (filters.visa_type) query = query.eq('visa_type', filters.visa_type)
  const { data, error } = await query
  return { data, error }
}
