// Database utilities with graceful fallback handling
import { supabase } from '@/lib/supabase';

// Test database connectivity
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    return !error;
  } catch (error) {
    console.warn('Database connection test failed:', error);
    return false;
  }
}

// Enhanced error handler for database operations
export function handleDatabaseError(error: any, operation: string, fallbackValue?: any) {
  console.warn(`Database operation '${operation}' failed:`, error);
  
  // Check if it's a network/connection error
  if (error?.message?.includes('fetch') || 
      error?.message?.includes('network') || 
      error?.message?.includes('connection') ||
      error?.code === 'PGRST301') {
    console.log(`Falling back to demo mode for ${operation}`);
    return { useDemo: true, data: fallbackValue };
  }
  
  // For other errors, throw them
  throw error;
}

// Wrapper for database operations with automatic fallback
export async function withDatabaseFallback<T>(
  databaseOperation: () => Promise<T>,
  fallbackValue: T,
  operationName: string
): Promise<T> {
  try {
    const result = await databaseOperation();
    return result;
  } catch (error) {
    const handled = handleDatabaseError(error, operationName, fallbackValue);
    if (handled.useDemo) {
      return handled.data;
    }
    throw error;
  }
}

// Check if we're in demo mode (no database available)
export async function isDemoMode(): Promise<boolean> {
  return !(await testDatabaseConnection());
}
