/**
 * Uploads a Blob straight to Supabase Storage's REST endpoint using a plain
 * XMLHttpRequest instead of the supabase-js client, purely so we get real
 * `xhr.upload.onprogress` byte-level progress -- the SDK's storage upload has
 * no progress hook, and the alternative (TUS resumable uploads) is built for
 * resuming multi-GB transfers, more than this needs for a 60s clip with a
 * simple retry-on-failure button.
 */
export function uploadWithProgress(
  bucket: string,
  path: string,
  blob: Blob,
  onProgress: (pct: number) => void
): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  // Strip codec parameters (e.g. "video/mp4;codecs=avc1") before sending as
  // Content-Type -- the storage bucket's allowed_mime_types only lists bare
  // types ("video/mp4", "video/webm"), and Supabase rejects anything that
  // doesn't match exactly.
  const contentType = blob.type.split(";")[0];

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${supabaseUrl}/storage/v1/object/${bucket}/${path}`);
    xhr.setRequestHeader("apikey", key);
    xhr.setRequestHeader("Authorization", `Bearer ${key}`);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.setRequestHeader("x-upsert", "true");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(`${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`);
      } else {
        reject(new Error(`Upload failed (${xhr.status}): ${xhr.responseText}`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(blob);
  });
}
