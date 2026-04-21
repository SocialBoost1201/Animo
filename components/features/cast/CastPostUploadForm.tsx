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
    } catch {
      toast.error('システムエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex w-full rounded-[14px] border border-[#c9a76a]/20 bg-[#0b0d12] p-1">
        <button
          type="button"
          onClick={() => setStep('edit')}
          className={`inline-flex h-[40px] flex-1 items-center justify-center gap-2 rounded-[10px] px-5 text-[14px] transition-all ${
            step === 'edit' ? 'bg-[#c9a76a]/10 font-bold text-[#c9a76a]' : 'text-[#6b7280] hover:text-[#a9afbc]'
          }`}
        >
          <Camera className="h-[14px] w-[14px]" />
          編集
        </button>
        <button
          type="button"
          onClick={() => setStep('preview')}
          className={`inline-flex h-[40px] flex-1 items-center justify-center gap-2 rounded-[10px] px-5 text-[14px] transition-all ${
            step === 'preview' ? 'bg-[#c9a76a]/10 font-bold text-[#c9a76a]' : 'text-[#6b7280] hover:text-[#a9afbc]'
          }`}
        >
          <ImageIcon className="h-[14px] w-[14px]" />
          プレビュー
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 'edit' ? (
          <>
            <div className="space-y-1">
              <label className="block text-[12px] font-bold tracking-[0.05em] text-[#c9a76a]">タイトル</label>
              <input
                value={content.split('\n')[0] ?? ''}
                onChange={(e) => {
                  const rest = content.split('\n').slice(1).join('\n');
                  setContent(rest ? `${e.target.value}\n${rest}` : e.target.value);
                }}
                placeholder="ブログのタイトル..."
                className="h-[54px] w-full rounded-[14px] border border-white/10 bg-[#0b0d12] px-[16px] text-[16px] font-medium text-[#f7f4ed] placeholder:text-[rgba(247,244,237,0.3)] focus:border-[#c9a76a]/50 focus:outline-hidden focus:ring-1 focus:ring-[#c9a76a]/50"
                maxLength={60}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[12px] font-bold tracking-[0.05em] text-[#c9a76a]">本文</label>
              <textarea
                value={content.split('\n').slice(1).join('\n')}
                onChange={(e) => {
                  const title = content.split('\n')[0] ?? '';
                  setContent(title ? `${title}\n${e.target.value}` : e.target.value);
                }}
                placeholder="今日あったこと、お客様へのメッセージ..."
                className="min-h-[280px] w-full resize-none rounded-[14px] border border-white/10 bg-[#0b0d12] p-[16px] text-[15px] leading-[1.8] text-[#f7f4ed] placeholder:text-[rgba(247,244,237,0.3)] focus:border-[#c9a76a]/50 focus:outline-hidden focus:ring-1 focus:ring-[#c9a76a]/50"
                maxLength={500}
              />
              <div className="text-right text-[12px] font-medium text-[#6b7280]">{content.length} / 500</div>
            </div>

            <div className="space-y-1">
              <label className="block text-[12px] font-bold tracking-[0.05em] text-[#c9a76a]">画像（任意）</label>
              <div
                className="flex h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border-2 border-dashed border-white/10 bg-[#0b0d12] hover:border-[#c9a76a]/40 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={previewUrl} alt="Preview" className="h-full w-full rounded-[12px] object-cover" />
                ) : (
                  <>
                    <ImageIcon className="h-7 w-7 text-[#c9a76a]/70" />
                    <div className="text-[14px] font-bold text-[#f7f4ed]">画像を追加</div>
                    <div className="text-[12px] text-[#6b7280]">JPG / PNG / WebP</div>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            </div>

            <div className="hidden">
              {SUGGESTED_TAGS.map((tag) => (
                <button key={tag} type="button" onClick={() => appendTag(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="flex min-h-[192px] flex-col items-center justify-center gap-4 rounded-[16px] py-8">
            {content.trim() ? (
              <div className="w-full rounded-[16px] border border-[#c9a76a]/20 bg-[#0b0d12] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                <h2 className="text-[20px] font-bold text-[#c9a76a]">{content.split('\n')[0]}</h2>
                <p className="mt-4 whitespace-pre-wrap text-[15px] leading-[1.8] text-[#f7f4ed]">{content.split('\n').slice(1).join('\n')}</p>
                {previewUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={previewUrl} alt="Preview" className="mt-5 w-full rounded-[12px] object-cover" />
                ) : null}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <ImageIcon className="mb-3 h-10 w-10 text-[#6b7280]/50" />
                <div className="text-[15px] font-bold text-[#a9afbc]">プレビューを表示するには</div>
                <div className="mt-1 text-[13px] text-[#6b7280]">タイトルまたは本文を入力してください</div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 rounded-[18px] border border-[#c9a76a] bg-[rgba(201,167,106,0.04)] p-5 shadow-[0_0_20px_rgba(201,167,106,0.15)]">
          {step === 'preview' ? (
            <Button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="h-[60px] w-full rounded-[14px] bg-[#c9a76a] text-[16px] font-bold tracking-[0.05em] text-[#0b0d12] transition-all hover:bg-[#d8b87b] disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  投稿中...
                </span>
              ) : (
                'ブログを送信します'
              )}
            </Button>
          ) : (
            <Button
              type="button"
              disabled={!content.trim()}
              onClick={() => setStep('preview')}
              className="h-[60px] w-full rounded-[14px] bg-[#c9a76a] text-[16px] font-bold tracking-[0.05em] text-[#0b0d12] transition-all hover:bg-[#d8b87b] disabled:opacity-50"
            >
              プレビューへ進む
            </Button>
          )}
          {!content.trim() && (
            <p className="mt-4 text-center text-[12px] font-medium text-[#c9a76a]/70">タイトルまたは本文を入力すると送信できます</p>
          )}
        </div>
      </form>
    </div>
  );
};
