//backend client:
import { StorageClient } from '@supabase/storage-js'

const STORAGE_URL = process.env.SUPABASE_STORAGE_URL as string;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY as string;

// storage client:
export const storageClient = new StorageClient(STORAGE_URL, {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
})

