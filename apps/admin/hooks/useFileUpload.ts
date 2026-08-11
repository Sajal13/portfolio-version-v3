'use client';

import { useMutation } from '@tanstack/react-query';

export const ALLOWED_UPLOAD_FOLDERS = [
  'portfolio',
  'banner',
  'tools',
  'blogs',
  'testimonial',
  'categories',
  'resume'
] as const;

export type UploadFolder = (typeof ALLOWED_UPLOAD_FOLDERS)[number];

export interface UploadedResponse {
  id: string;
  originalName: string;
  url: string;
}

interface UploadPayload {
  file: File;
  folder: UploadFolder;
}

interface UploadApiResponse {
  data: UploadedResponse; // Cloudinary URL for images, row id for markdown/pdf
  message: string;
}

async function uploadFile({
  file,
  folder
}: UploadPayload): Promise<UploadedResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  // Hits the Next.js Route Handler (BFF), not the backend directly
  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message ?? 'Upload failed');
  }

  const json: UploadApiResponse = await res.json();
  return json.data;
}

export function useFileUpload() {
  return useMutation({ mutationFn: uploadFile });
}
