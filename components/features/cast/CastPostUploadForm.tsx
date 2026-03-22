'use client';

import React, { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { Button } from '@/components/ui/Button';
import { Camera, Image as ImageIcon, Loader2 } from 'lucide-react';
import { createCastPost } from '@/lib/actions/cast-posts';
import { toast } from 'sonner';

/**
 * キャスト向け：投稿フォーム（プレビュー機能つき）
 */
export const CastPostUploadForm = ({ castId }: { castId: string }) => {
  const [step, setStep] = useState<'edit' | 'preview'>('edit');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const SUGGESTED_TAGS = ['#関内', '#横浜キャバクラ', '#関内キャバクラ', '#シャンパン', '#同伴', '#アフター', '#キャバ嬢', '#今日のおすすめ'];

  const appendTag = (tag: string) => {
    if (!content.includes(tag)) {
      setContent(prev => prev ? `${prev} ${tag}` : tag);
    }
  };

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
        setStep('edit');
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
            accept="image/*"
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
          {/* SEO推奨タグサジェスト */}
          <div className="mt-3">
            <p className="text-xs text-gray-400 tracking-widest mb-2 font-bold uppercase">suggested tags / おすすめタグ</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => appendTag(tag)}
                  className={`text-xs px-2.5 py-1 rounded-full transition-colors border ${
                    content.includes(tag) 
                    ? 'bg-gold border-gold text-white font-bold' 
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gold hover:text-gold'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ボタン周り */}
        {step === 'edit' ? (
          <Button 
            type="button" 
            disabled={!file || !content.trim()}
            onClick={() => setStep('preview')}
            className="w-full bg-[#171717] hover:bg-gold text-white font-bold tracking-widest uppercase py-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            プレビューを確認する
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
              <p className="text-xs text-center text-gray-500 font-bold mb-4">以下の内容で投稿をご提出しますか？</p>
              
              {/* 簡易プレビュー */}
              <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-4/5 w-full bg-gray-100 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl!} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap wrap-break-word">{content}</p>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gold hover:bg-gold/90 text-white font-bold tracking-widest uppercase py-6 rounded-xl transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Posting...
                </>
              ) : (
                'この内容で投稿する'
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              disabled={isSubmitting}
              onClick={() => setStep('edit')}
              className="w-full bg-white text-gray-500 font-bold tracking-widest py-6 rounded-xl transition-all"
            >
              修正にもどる
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
