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
    <div className="mx-auto max-w-md">
      <div className="mb-5 flex w-fit rounded-[12px] border border-white/8 bg-[#181d27] p-1">
        <button
          type="button"
          onClick={() => setStep('edit')}
          className={`inline-flex h-[35px] items-center gap-2 rounded-[9px] px-5 text-[13px] ${
            step === 'edit' ? 'bg-[#131720] font-bold text-[#f7f4ed] shadow-[0_1px_4px_rgba(0,0,0,0.3)]' : 'text-[#6b7280]'
          }`}
        >
          <Camera className="h-[13px] w-[13px]" />
          編集
        </button>
        <button
          type="button"
          onClick={() => setStep('preview')}
          className={`inline-flex h-[35px] items-center gap-2 rounded-[9px] px-5 text-[13px] ${
            step === 'preview' ? 'bg-[#131720] font-bold text-[#f7f4ed] shadow-[0_1px_4px_rgba(0,0,0,0.3)]' : 'text-[#6b7280]'
          }`}
        >
          <ImageIcon className="h-[13px] w-[13px]" />
          プレビュー
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 'edit' ? (
          <>
            <div>
              <label className="mb-2 block text-[11px] font-medium tracking-[0.05em] text-[#6b7280]">タイトル</label>
              <input
                value={content.split('\n')[0] ?? ''}
                onChange={(e) => {
                  const rest = content.split('\n').slice(1).join('\n');
                  setContent(rest ? `${e.target.value}\n${rest}` : e.target.value);
                }}
                placeholder="ブログのタイトル..."
                className="h-[49px] w-full rounded-[12px] border border-white/8 bg-[#181d27] px-[14px] text-[16px] font-medium text-[#f7f4ed] placeholder:text-[rgba(247,244,237,0.5)] focus:outline-hidden"
                maxLength={60}
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-medium tracking-[0.05em] text-[#6b7280]">本文</label>
              <textarea
                value={content.split('\n').slice(1).join('\n')}
                onChange={(e) => {
                  const title = content.split('\n')[0] ?? '';
                  setContent(title ? `${title}\n${e.target.value}` : e.target.value);
                }}
                placeholder="今日あったこと、お客様へのメッセージ..."
                className="min-h-[270px] w-full resize-none rounded-[12px] border border-white/8 bg-[#181d27] px-[14px] py-3 text-[14px] leading-[24.5px] text-[#f7f4ed] placeholder:text-[rgba(247,244,237,0.5)] focus:outline-hidden"
                maxLength={500}
              />
              <div className="mt-2 text-right text-[11px] text-[#6b7280]">{content.length} 文字</div>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-medium tracking-[0.05em] text-[#6b7280]">画像（任意）</label>
              <div
                className="flex h-[126px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed border-white/14"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={previewUrl} alt="Preview" className="h-full w-full rounded-[14px] object-cover" />
                ) : (
                  <>
                    <ImageIcon className="h-6 w-6 text-[#6b7280]" />
                    <div className="text-[13px] font-medium text-[#a9afbc]">画像を追加</div>
                    <div className="text-[11px] text-[#6b7280]">JPG / PNG / WebP</div>
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
          <div className="flex min-h-[192px] flex-col items-center justify-center gap-3 rounded-[12px] py-12">
            {content.trim() ? (
              <div className="w-full rounded-[16px] border border-white/8 bg-[#131720] p-4">
                <h2 className="text-[18px] font-bold text-[#f7f4ed]">{content.split('\n')[0]}</h2>
                <p className="mt-3 whitespace-pre-wrap text-[14px] leading-[24px] text-[#a9afbc]">{content.split('\n').slice(1).join('\n')}</p>
                {previewUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={previewUrl} alt="Preview" className="mt-4 w-full rounded-[12px] object-cover" />
                ) : null}
              </div>
            ) : (
              <>
                <ImageIcon className="h-8 w-8 text-[#6b7280]" />
                <div className="text-[14px] text-[#a9afbc]">プレビューを表示するには</div>
                <div className="text-[13px] text-[#6b7280]">タイトルまたは本文を入力してください</div>
              </>
            )}
          </div>
        )}

        <div className="border-t border-white/8 pt-4">
          {step === 'preview' ? (
            <Button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="h-[58px] w-full rounded-[16px] bg-[rgba(255,255,255,0.05)] text-[15px] font-bold text-[#6b7280] hover:bg-[rgba(255,255,255,0.08)] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  投稿中...
                </>
              ) : (
                'タイトルと本文を入力してください'
              )}
            </Button>
          ) : (
            <Button
              type="button"
              disabled={!content.trim()}
              onClick={() => setStep('preview')}
              className="h-[58px] w-full rounded-[16px] bg-[rgba(255,255,255,0.05)] text-[15px] font-bold text-[#6b7280] hover:bg-[rgba(255,255,255,0.08)] disabled:opacity-50"
            >
              タイトルと本文を入力してください
            </Button>
          )}
          <div className="mt-3 text-center text-[12px] text-[#6b7280]">タイトルと本文を入力すると投稿できます</div>
        </div>
      </form>
    </div>
  );
};
