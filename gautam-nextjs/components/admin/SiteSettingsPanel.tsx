'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function SiteSettingsPanel() {
  const [heroImage, setHeroImage] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/settings?key=hero_image')
      .then((res) => res.json())
      .then((data) => {
        const img = data.value || '/sano-thaili.jpg';
        setHeroImage(img);
        setPreviewImage(img);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
    setStatus(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);

    try {
      let imageUrl = heroImage;

      // Upload new file if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadData.success) throw new Error('Image upload failed');
        imageUrl = uploadData.url;
      }

      // Save to DB
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'hero_image', value: imageUrl }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setHeroImage(imageUrl);
      setImageFile(null);
      setStatus({ type: 'success', message: 'Hero image updated! Refresh the home page to see it.' });
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-red-900" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Hero Background Image</h3>
        <p className="text-sm text-gray-500 mb-6">
          This is the full-screen background image shown at the top of your home page.
        </p>

        {/* Preview */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative w-full h-72 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-red-900 transition-colors cursor-pointer bg-gray-50"
        >
          {previewImage && (
            <Image
              src={previewImage}
              alt="Hero preview"
              fill
              className="object-cover opacity-80 group-hover:opacity-60 transition-opacity"
            />
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-500 group-hover:text-red-900 transition-colors">
            <div className="bg-white/80 backdrop-blur rounded-xl px-5 py-3 flex flex-col items-center gap-2 shadow">
              <ImageIcon className="w-8 h-8" />
              <span className="text-sm font-semibold">Click to upload a new image</span>
              <span className="text-xs text-gray-400">JPG, PNG, WEBP recommended</span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {imageFile && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 bg-blue-50 rounded-md px-4 py-2">
            <Upload className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>New image selected: <strong>{imageFile.name}</strong></span>
          </div>
        )}

        {/* Status Message */}
        {status && (
          <div className={`mt-4 flex items-start gap-2 rounded-md px-4 py-3 text-sm font-medium ${
            status.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}>
            {status.type === 'success'
              ? <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
            {status.message}
          </div>
        )}

        {/* Save button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || !imageFile}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-900 text-white text-sm font-semibold rounded-md hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Saving...' : 'Save Hero Image'}
          </button>
        </div>
      </div>
    </div>
  );
}
