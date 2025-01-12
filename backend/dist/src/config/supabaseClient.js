"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
// Supabase URL and Anon Key (Get these from your Supabase dashboard)
const SUPABASE_URL = "https://sznbpyyqjiezllgxbgie.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6bmJweXlxamllemxsZ3hiZ2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyOTQxNzIsImV4cCI6MjA0OTg3MDE3Mn0.IbF7v7aBHccs6Ny8nEWlzpPagidHDLWSXKF76nBKDwU";
// Initialize Supabase client
const supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_ANON_KEY);
exports.default = supabase;
