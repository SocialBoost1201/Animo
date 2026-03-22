'use client';

import { useState, useRef, useTransition, useCallback } from 'react';
import { toast } from 'sonner';
import { uploadCastImages, deleteCastImage, setPrimaryImage } from '@/lib/actions/cast-images';
import { Upload, Trash2, Star, ImagePlus, Loader2 } from 'lucide-react';

type CastImage = {
  id: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
};

export function CastImageManager({ castId, images: initialImages }: { castId: string; images: CastImage[] }) {
  const [images, setImages] = useState<CastImage[]>(initialImages);
  const [isPending, startTransition] = useTransition();
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (!validFiles.length) {
      toast.error('画像ファイルを選択してください（JPG・PNG・WebP対応）');
      return;
    }
    startTransition(async () => {
      const fd = new FormData();
      validFiles.forEach((f) => fd.append('images', f));
      const result = await uploadCastImages(castId, fd);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${validFiles.length}枚の画像をアップロードしました`);
        // サーバーから最新データを再取得するためにリロード
        window.location.reload();
      }
    });
  }, [castId]);

  const handleDelete = useCallback(async (imageId: string) => {
    if (!confirm('この画像を削除しますか？')) return;
    startTransition(async () => {
      const result = await deleteCastImage(imageId, castId);
      if (result.error) {
        toast.error(result.error);
      } else {
        setImages((prev) => prev.filter((img) => img.id !== imageId));
        toast.success('画像を削除しました');
      }
    });
  }, [castId]);

  const handleSetPrimary = useCallback(async (imageId: string) => {
    startTransition(async () => {
      const result = await setPrimaryImage(imageId, castId);
      if (result.error) {
        toast.error(result.error);
      } else {
        setImages((prev) => prev.map((img) => ({ ...img, is_primary: img.id === imageId })));
        toast.success('メイン画像を変更しました');
      }
    });
  }, [castId]);

  return (
    <div className="space-y-4">
      {/* Upload Drop Zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleUpload(e.dataTransfer.files);
        }}
        className={`relative border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-all duration-200 ${
          dragOver
            ? 'border-gold bg-gold/5 scale-[1.01]'
            : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
        />
        {isPending ? (
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Loader2 size={20} className="animate-spin text-gold" />
            <span className="text-sm">アップロード中...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <div className={`p-3 rounded-full transition-colors ${dragOver ? 'bg-gold/10' : 'bg-gray-100'}`}>
              <ImagePlus size={24} className={dragOver ? 'text-gold' : 'text-gray-400'} />
            </div>
            <p className="text-sm font-medium text-gray-600">
              ドラッグ＆ドロップ または クリックして選択
            </p>
            <p className="text-xs text-gray-400">JPG, PNG, WebP ・ 複数ファイル可</p>
          </div>
        )}
      </div>

      {/* Image Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[...images].sort((a, b) => a.sort_order - b.sort_order).map((img) => (
            <div key={img.id} className="relative group aspect-[4/5] overflow-hidden rounded-sm border border-gray-100 bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.image_url}
                alt="cast"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Primary Badge */}
              {img.is_primary && (
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-gold text-black text-xs font-bold px-2 py-0.5 rounded">
                  <Star size={9} fill="black" />
                  メイン
                </div>
              )}

              {/* Actions Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {!img.is_primary && (
                  <button
                    onClick={() => handleSetPrimary(img.id)}
                    disabled={isPending}
                    title="メイン画像に設定"
                    className="p-2 bg-gold text-black rounded-full hover:bg-gold/80 transition-colors"
                  >
                    <Star size={14} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(img.id)}
                  disabled={isPending}
                  title="削除"
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-sm text-gray-400">
          まだ画像がありません。上のエリアに画像をドラッグ＆ドロップしてください。
        </div>
      )}

      <p className="text-xs text-gray-400">
        ⭐ メイン画像がサイトのキャスト一覧・シフトページに表示されます
      </p>
    </div>
  );
}
