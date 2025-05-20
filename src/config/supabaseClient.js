import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_ANON_KEY;
const email = process.env.REACT_APP_USER_EMAIL;
const password = process.env.REACT_APP_USER_PASSWORD;

const supabase = createClient(supabaseUrl, supabaseKey);

const { data, error } = async () => await supabase.auth.signInWithPassword({ email, password });

if (error) {
    console.error('Не удалось войти в supabase!');
} else if (data) {
    console.log('Успешный вход в supabase.');
}

export default supabase;