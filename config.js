// config.js
// Supabase project credentials
const SUPABASE_URL = "https://ntvcmqvcwkzrgsexpnip.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50dmNtcXZjd2t6cmdzZXhwbmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MDk4MDAsImV4cCI6MjA3MjM4NTgwMH0.uVbUY27Lgkj7QGDliGPlWiE3QAhbzG3DiCiPOFYUWrI";  

// Create client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
