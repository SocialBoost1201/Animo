'use client';

import React, { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { Button } from '@/components/ui/Button';
import { Camera, Image as ImageIcon, Loader2 } from 'lucide-react';
import { createCastPost } from '@/lib/actions/cast-posts';
import { toast } from 'sonner';

/**
 * キャスト向け：10秒で投稿完了するInstagram風の投稿フォーム
 */
export const CastPostUploadForm = ({ castId }: { castId: string }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      // プレビュー表示用
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);

      // クライアントで画像圧縮とEXIF削除 (WebP変換)
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 1080,
        useWebWorker: true,
        fileType: 'image/webp'
      };
      const compressedFile = await imageCompression(selectedFile, options);
      setFile(compressedFile);
    } catch (err) {
      console.error('Image compression failed', err);
      toast.error('画像処理に失敗しました。別の画像をお試しください。');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !content.trim()) {
      toast.error('画像とコメントは必須です。');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('content', content);
      formData.append('castId', castId);

      const result = await createCastPost(formData);
      
      if (result.success) {
        toast.success('投稿を送信しました！（管理者の確認後に公開されます）');
        // フォームのリセット
        setFile(null);
        setPreviewUrl(null);
        setContent('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        toast.error(result.error || '投稿に失敗しました。');
      }
    } catch (err) {
      toast.error('システムエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-aura overflow-hidden border border-gray-100 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 画像アップロードエリア */}
        <div 
          className="relative w-full aspect-4/5 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer overflow-hidden group"
          onClick={() => fileInputRef.current?.click()}
        >
          {previewUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center text-gray-400 group-hover:text-gold transition-colors">
              <Camera className="w-12 h-12 mb-3" />
              <span className="text-xs font-bold tracking-widest uppercase">Tap to upload</span>
            </div>
          )}
          
          <input 
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          
          {previewUrl && (
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm p-2 rounded-full text-white cursor-pointer hover:bg-black/80 transition-colors">
              <ImageIcon className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* コメント入力 */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="今日の出来事やメッセージを入力..."
            className="w-full min-h-[120px] p-4 bg-gray-50 border border-gray-100 rounded-xl resize-none focus:outline-hidden focus:ring-2 focus:ring-gold/30 text-sm md:text-base"
            required
            maxLength={500}
          />
        </div>

        {/* 送信ボタン */}
        <Button 
          type="submit" 
          disabled={!file || !content.trim() || isSubmitting}
          className="w-full bg-[#171717] hover:bg-gold text-white font-bold tracking-widest uppercase py-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              Posting...
            </>
          ) : (
            '投稿する'
          )}
        </Button>
      </form>
    </div>
  );
};
