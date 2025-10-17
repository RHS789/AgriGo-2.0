const createClient = supabaseLib && (supabaseLib.createClient || (supabaseLib.default && supabaseLib.default.createClient));


const createClient = supabaseLib && (supabaseLib.createClient || (supabaseLib.default && supabaseLib.default.createClient));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  const errorMsg = 'Supabase not configured: set SUPABASE_URL and SUPABASE_ANON_KEY';
  supabase = new Proxy({}, {
    get() {
      throw new Error(errorMsg);
    }
  });
}

module.exports = supabase;
