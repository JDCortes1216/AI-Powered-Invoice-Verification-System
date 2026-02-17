import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fovezflamqhgyhctxolq.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvdmV6ZmxhbXFoZ3loY3R4b2xxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMjE3MzksImV4cCI6MjA4Njg5NzczOX0.HGOPNlhvRUPADiGG_Tfhx8vfmQ8J2sxvDMV3Vu6o6dk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
