import { createClient } from "@supabase/supabase-js";

// Exported keys for static environment compatibility
const supabaseUrl = "https://wvsdsaeyqqaguzhhdezs.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2c2RzYWV5cXFhZ3V6aGhkZXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNDUyODQsImV4cCI6MjA5MDcyMTI4NH0.stfUuaid6fQtG6Q4Dmd8q951lrjCQMQIkGgstk0Ry3A";

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey);
