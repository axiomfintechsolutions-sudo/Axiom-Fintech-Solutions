// ═══════════════════════════════════════════════════════════════
//  AXIOM FINTECH — CLIENT PORTAL · Firebase Configuration
//  Replace the values below with your actual Firebase project config.
//  Get them from: Firebase Console → Project Settings → Your Apps → Web
// ═══════════════════════════════════════════════════════════════
const firebaseConfig = {
  apiKey:            "AIzaSyCw2LwFPrlZ9jFTHgliFbaH41bopKjJ3Qw",
  authDomain:        "axiom-client-portal.firebaseapp.com",
  projectId:         "axiom-client-portal",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "1074823413540",
  appId:             "1:1074823413540:web:39e55a8b30da23aae4fdb1"
};

// ── Admin emails ─────────────────────────────────────────────────
// Only these email addresses can access the Admin Panel (admin.html).
const ADMIN_EMAILS = [
  'axiomfintechsolutions@gmail.com'
];

// ── Firebase Initialization ───────────────────────────────────────
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();
// NOTE: Firebase Storage is NOT used — we use Supabase Storage instead.

// ── Supabase Configuration (used for file storage only) ───────────
// Auth + Firestore remain on Firebase above.
const SUPABASE_URL  = "https://iuqxtlwfefkojdgddzgq.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1cXh0bHdmZWZrb2pkZ2RkemdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NjI5MTIsImV4cCI6MjA5NDAzODkxMn0.I943p5aXxABKk_G32cgfIQgCae8ulf-uhZ9rYa_SmXo";

// ── Supabase Storage Helpers ──────────────────────────────────────
const supabase = {

  // Upload a file to a bucket under a user-scoped path
  async uploadFile(bucket, uid, file) {
    const path = `${uid}/${Date.now()}_${file.name}`;
    const res  = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON}`,
        'Content-Type':  file.type || 'application/octet-stream',
        'x-upsert':      'false',
      },
      body: file,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Upload failed');
    }
    return path;
  },

  // Get a signed download URL (valid for 1 hour)
  async getSignedUrl(bucket, path) {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/sign/${bucket}/${path}`, {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({ expiresIn: 3600 }),
    });
    if (!res.ok) throw new Error('Could not generate download URL');
    const data = await res.json();
    return `${SUPABASE_URL}/storage/v1${data.signedURL}`;
  },

  // Delete a file from a bucket
  async deleteFile(bucket, path) {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
      method:  'DELETE',
      headers: { 'Authorization': `Bearer ${SUPABASE_ANON}` },
    });
    return res.ok;
  },
};
