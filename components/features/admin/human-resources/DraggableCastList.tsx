'use client';

import { useState, useTransition } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { Edit2, Eye, EyeOff, Sparkles, GripVertical, Save, Loader2, Trash2, Trophy, Star } from 'lucide-react';
import { DeleteCastButton } from '@/components/features/admin/DeleteCastButton';
import { updateCastOrder } from '@/lib/actions/cast-order';
import { bulkUpdateCastsStatus, bulkDeleteCasts } from '@/lib/actions/cast-bulk';
import { toast } from 'sonner';

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from 'next/link';

type CastType = {
  id: string;
  stage_name: string;
  name?: string;
  image_url?: string;
  age?: number;
  hobby?: string;
  quiz_tags?: string[];
  is_active?: boolean;
  status?: string;
  display_order: number;
  score: number;
  level: number;
};

function SortableCastRow({
  cast,
  isSelected,
  onToggleSelect,
}: {
  cast: CastType;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cast.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-black/94 border rounded-[22px] p-5 md:p-0 transition-all duration-300 font-sans ${
        isDragging ? 'shadow-2xl scale-[1.03] border-gold bg-black/90 ring-8 ring-gold/10' : 'shadow-[0_8px_20px_-4px_rgba(0,0,0,0.5)] hover:shadow-2xl'
      } ${isSelected ? 'border-gold bg-gold/5' : 'border-[#ffffff10] hover:border-[#ffffff20]'}`}
    >
      {/* Mobile Top Controls */}
      <div className="flex justify-between items-start md:hidden mb-6">
        <label className="flex items-center gap-4 cursor-pointer">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(cast.id)}
            className="w-6 h-6 rounded border-gray-300 text-gold focus:ring-gold focus:ring-offset-0 cursor-pointer transition-all"
          />
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-2 rounded-xl text-[#8a8478] hover:text-[#f4f1ea] hover:bg-white/5 transition-colors"
          >
            <GripVertical size={24} />
          </div>
        </label>
        
        <div className="flex justify-end items-center gap-3">
          <Link
            href={`/admin/human-resources/${cast.id}`}
            className="p-3 text-[#8a8478] hover:text-gold transition-all duration-200 rounded-xl hover:bg-white/5"
          >
            <Edit2 size={20} />
          </Link>
          <DeleteCastButton castId={cast.id} castName={cast.stage_name || cast.name || '名前なし'} />
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="flex flex-col md:grid md:grid-cols-[auto_80px_3fr_1.2fr_1.8fr_1.2fr_1.8fr_auto] md:items-center gap-6 md:gap-8 md:px-10 md:py-8">
        
        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-4">
          <label className="cursor-pointer">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(cast.id)}
              className="w-5 h-5 rounded border-[#ffffff15] bg-white/5 text-gold focus:ring-gold focus:ring-offset-0 cursor-pointer transition-all"
            />
          </label>
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-2 rounded-xl text-[#5a5650] hover:text-gold hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100"
          >
            <GripVertical size={20} />
          </div>
        </div>

        {/* Profile Image & Name (Mobile combined, Desktop separated) */}
        <div className="flex items-center gap-6 md:contents">
          {/* Image */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-[#121111] border border-[#ffffff10] shrink-0 shadow-2xl relative group-hover:border-gold/30 transition-all duration-500">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cast.image_url} alt={cast.stage_name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#5a5650] text-2xl md:text-xl font-serif">
                {(cast.stage_name || cast.name || '?')[0]}
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
          </div>

          {/* Name & Hobby */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1.5 font-sans">
              <p className="font-bold text-[#f4f1ea] text-xl md:text-[18px] truncate tracking-tight group-hover:text-gold transition-colors">{cast.stage_name || cast.name}</p>
              {/* Mobile Age Pill */}
              <span className="md:hidden text-xs font-bold bg-white/5 text-[#8a8478] px-2.5 py-1 rounded-full border border-white/5">
                {cast.age ? `${cast.age}歳` : '年齢非公開'}
              </span>
            </div>
            {cast.hobby && <p className="text-[13px] text-[#8a8478] truncate mt-1 md:mt-0 font-sans opacity-80">{cast.hobby}</p>}
          </div>
        </div>

        {/* Age (Desktop) */}
        <div className="hidden md:block text-[15px] font-bold text-[#c7c0b2] font-sans">
          {cast.age ? `${cast.age}歳` : <span className="text-[#5a5650]">-</span>}
        </div>

        {/* Score & Level (Premium UI) */}
        <div className="flex md:flex-col items-center md:items-start justify-between md:justify-center mt-6 md:mt-0 pt-6 md:pt-0 border-t border-white/5 md:border-0">
          <span className="md:hidden text-xs font-bold text-[#5a5650] tracking-widest">SCORE</span>
          <div className="flex flex-col md:gap-1.5 items-end md:items-start">
            <span className="font-serif font-bold text-xl md:text-[18px] text-[#f4f1ea] flex items-center gap-2">
              <Trophy className="w-4 h-4 text-gold hidden md:block" />
              {cast.score.toLocaleString()} <span className="text-[11px] text-[#5a5650] tracking-wider uppercase font-sans font-black">pt</span>
            </span>
            <span className="text-[11px] font-black text-gold bg-gold/10 px-2 py-1 rounded-md flex items-center gap-1.5 w-fit border border-gold/20 shadow-sm">
              <Star className="w-3 h-3 fill-current" /> LEVEL {cast.level}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex md:block items-center justify-between mt-4 md:mt-0">
           <span className="md:hidden text-xs font-bold text-[#5a5650] tracking-widest">TAGS</span>
          {cast.quiz_tags && cast.quiz_tags.length > 0 ? (
            <div className="flex items-center gap-2 text-[#c7c0b2] bg-white/5 px-3 py-1.5 md:px-0 md:bg-transparent rounded-xl">
              <Sparkles size={16} className="text-gold/60" />
              <span className="text-[13px] font-bold font-sans">{cast.quiz_tags.length} <span className="font-medium text-[#5a5650] hidden lg:inline ml-1">項目設定済み</span></span>
            </div>
          ) : (
            <span className="text-[13px] font-bold text-[#5a5650] flex items-center gap-2 font-sans">
              <div className="w-2 h-2 rounded-full bg-[#ffffff10]" /> 未設定
            </span>
          )}
        </div>

        {/* Status */}
        <div className="flex md:block items-center justify-between mt-4 md:mt-0">
           <span className="md:hidden text-xs font-bold text-[#5a5650] tracking-widest">STATUS</span>
          <span
            className={`inline-flex items-center gap-2 px-4 py-1.5 md:px-3 md:py-1 rounded-full text-[11px] font-black uppercase tracking-[1px] transition-all shadow-sm ${
              cast.is_active ?? cast.status === 'public'
                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                : 'bg-white/5 text-[#5a5650] border border-white/10'
            }`}
          >
            {cast.is_active ?? cast.status === 'public' ? (
              <><Eye size={14} /> <span className="mt-px">PUBLIC</span></>
            ) : (
              <><EyeOff size={14} /> <span className="mt-px">PRIVATE</span></>
            )}
          </span>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex justify-end items-center gap-2">
          <Link
            href={`/admin/human-resources/${cast.id}`}
            className="p-2.5 text-[#5a5650] hover:text-gold transition-all duration-300 rounded-xl hover:bg-white/5 group/btn"
            title="編集"
          >
             <Edit2 size={18} className="transition-transform group-hover/btn:scale-110" />
          </Link>
          <div className="text-white/5 mx-2">|</div>
          <DeleteCastButton castId={cast.id} castName={cast.stage_name || cast.name || '名前なし'} />
        </div>

      </div>
    </div>
  );
}

export function DraggableCastList({ initialCasts }: { initialCasts: CastType[] }) {
  const [casts, setCasts] = useState(initialCasts);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCasts((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);
        
        return newArray.map((item, index) => ({
           ...item,
           display_order: index + 1
        }));
      });
    }
  };

  const saveOrder = () => {
    startTransition(async () => {
      const orders = casts.map((c) => ({
        id: c.id,
        display_order: c.display_order,
      }));
      const result = await updateCastOrder(orders);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('表示順を保存しました');
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === casts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(casts.map((c) => c.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkStatus = (isActive: boolean) => {
    if (selectedIds.size === 0) return;
    startTransition(async () => {
      const result = await bulkUpdateCastsStatus(Array.from(selectedIds), isActive);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${selectedIds.size}人のステータスを更新しました`);
        setCasts(casts.map(c => selectedIds.has(c.id) ? { ...c, is_active: isActive, status: isActive ? 'public' : 'private' } : c));
        setSelectedIds(new Set());
      }
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`選択した ${selectedIds.size} 人のキャストを本当に削除しますか？\nこの操作は元に戻せません。`)) return;

    startTransition(async () => {
      const result = await bulkDeleteCasts(Array.from(selectedIds));
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${selectedIds.size}人のキャストを削除しました`);
        setCasts(casts.filter(c => !selectedIds.has(c.id)));
        setSelectedIds(new Set());
      }
    });
  };

  const isAllSelected = casts.length > 0 && selectedIds.size === casts.length;
  const showBulkActions = selectedIds.size > 0;

  return (
    <div className="space-y-6">
      {/* 操作ヘッダー */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-h-[44px]">
        {/* 一括操作パネル */}
        <div className={`flex flex-wrap items-center gap-2 transition-opacity duration-200 ${showBulkActions ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <span className="text-sm font-bold text-[#5a5650] mr-2 border-r border-[#ffffff10] pr-4">
            {selectedIds.size}件選択中
          </span>
          <button
            onClick={() => handleBulkStatus(true)}
            disabled={isPending}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-green-500 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors shadow-sm"
          >
            <Eye size={14} /> 一括公開
          </button>
          <button
            onClick={() => handleBulkStatus(false)}
            disabled={isPending}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#f4f1ea] bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors shadow-sm"
          >
            <EyeOff size={14} /> 一括非公開
          </button>
          <button
            onClick={handleBulkDelete}
            disabled={isPending}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors shadow-sm sm:ml-2"
          >
            <Trash2 size={14} /> 一括削除
          </button>
        </div>

        <button
          onClick={saveOrder}
          disabled={isPending || showBulkActions}
          className="flex items-center justify-center gap-2 bg-[#1c1d22] border border-[#ffffff0f] hover:border-gold/50 text-[#f4f1ea] px-6 py-2.5 text-sm font-bold tracking-wider transition-all duration-300 disabled:opacity-50 rounded-lg shadow-md hover:shadow-lg ml-auto w-full sm:w-auto"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isPending ? '保存中...' : '順番を保存する'}
        </button>
      </div>

      <div className="w-full">
        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-[auto_60px_2.5fr_1fr_1.5fr_1fr_1.5fr_auto] gap-6 px-6 py-4 mb-3 text-xs tracking-widest text-[#5a5650] font-bold uppercase items-center">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={toggleSelectAll}
              disabled={casts.length === 0}
              className="w-4 h-4 rounded border-[#ffffff10] bg-white/5 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0 cursor-pointer transition-all"
            />
          </label>
          <div className="text-center">IMG</div>
          <div>CAST NAME</div>
          <div>AGE</div>
          <div>SCORE / RANK</div>
          <div>TAGS</div>
          <div>STATUS</div>
          <div className="text-right">ACTIONS</div>
        </div>

        {/* Drag Context & List */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="space-y-3">
            <SortableContext items={casts.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              {casts.map((cast) => (
                <SortableCastRow
                  key={cast.id}
                  cast={cast}
                  isSelected={selectedIds.has(cast.id)}
                  onToggleSelect={toggleSelect}
                />
              ))}
            </SortableContext>

            {(!casts || casts.length === 0) && (
              <div className="py-20 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-white/10">
                  <Star className="w-6 h-6 text-[#5a5650]" />
                </div>
                <p className="text-[#f4f1ea] font-bold">対象のキャストが見つかりません</p>
                <p className="text-sm text-[#8a8478] mt-1">検索条件を変更するか、新しくキャストを登録してください。</p>
              </div>
            )}
          </div>
        </DndContext>
      </div>
    </div>
  );
}
