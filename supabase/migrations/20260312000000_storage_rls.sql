-- Storage RLS Migration for 'images' bucket

-- 1. Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Setup RLS policies on storage.objects

-- Allow public read access to specific folders (casts, gallery, events, hero)
-- Note: 'public' in the bucket means anyone can access the URL if they know it,
-- but we also want to explicitly allow SELECT via API for these folders just in case.
CREATE POLICY "Public Access to specific image folders"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'images' 
  AND (
    (storage.foldername(name))[1] IN ('casts', 'gallery', 'events', 'hero', 'recruit')
  )
);

-- Allow authenticated users (Admins) to upload files
CREATE POLICY "Admins can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images'
);

-- Allow authenticated users (Admins) to update files
CREATE POLICY "Admins can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'images'
)
WITH CHECK (
  bucket_id = 'images'
);

-- Allow authenticated users (Admins) to delete files
CREATE POLICY "Admins can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'images'
);
