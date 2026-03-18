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
      className={`group relative bg-white border rounded-2xl p-4 md:p-0 transition-all duration-300 ${
        isDragging ? 'shadow-2xl scale-[1.02] border-yellow-400 bg-white ring-4 ring-yellow-400/10' : 'shadow-xs hover:shadow-md'
      } ${isSelected ? 'border-yellow-400 bg-yellow-50/30' : 'border-gray-100 hover:border-gray-200'}`}
    >
      {/* Mobile Top Controls */}
      <div className="flex justify-between items-start md:hidden mb-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(cast.id)}
            className="w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0 cursor-pointer transition-all"
          />
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg text-gray-400 hover:text-[#171717] hover:bg-gray-100 transition-colors"
          >
            <GripVertical size={20} />
          </div>
        </label>
        
        <div className="flex justify-end items-center gap-2">
          <Link
            href={`/admin/casts/${cast.id}`}
            className="p-2 text-gray-400 hover:text-[#171717] transition-all duration-200 rounded-lg hover:bg-gray-100"
          >
            <Edit2 size={16} />
          </Link>
          <DeleteCastButton castId={cast.id} castName={cast.stage_name || cast.name || '名前なし'} />
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="flex flex-col md:grid md:grid-cols-[auto_60px_2.5fr_1fr_1.5fr_1fr_1.5fr_auto] md:items-center gap-4 md:gap-6 md:px-6 md:py-4">
        
        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-3">
          <label className="cursor-pointer">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(cast.id)}
              className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0 cursor-pointer transition-all"
            />
          </label>
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg text-gray-300 hover:text-[#171717] hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
          >
            <GripVertical size={16} />
          </div>
        </div>

        {/* Profile Image & Name (Mobile combined, Desktop separated) */}
        <div className="flex items-center gap-4 md:contents">
          {/* Image */}
          <div className="w-14 h-14 md:w-12 md:h-12 rounded-full overflow-hidden bg-gray-50 border border-gray-100 shrink-0 shadow-inner">
            {cast.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cast.image_url} alt={cast.stage_name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg md:text-sm font-serif">
                {(cast.stage_name || cast.name || '?')[0]}
              </div>
            )}
          </div>

          {/* Name & Hobby */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="font-bold text-[#171717] text-lg md:text-sm truncate tracking-tight">{cast.stage_name || cast.name}</p>
              {/* Mobile Age Pill */}
              <span className="md:hidden text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {cast.age ? `${cast.age}歳` : '年齢非公開'}
              </span>
            </div>
            {cast.hobby && <p className="text-xs text-gray-500 truncate mt-1 md:mt-0">{cast.hobby}</p>}
          </div>
        </div>

        {/* Age (Desktop) */}
        <div className="hidden md:block text-sm font-medium text-gray-600">
          {cast.age ? `${cast.age}歳` : <span className="text-gray-300">-</span>}
        </div>

        {/* Score & Level (Premium UI) */}
        <div className="flex md:flex-col items-center md:items-start justify-between md:justify-center mt-4 md:mt-0 pt-4 md:pt-0 border-t border-gray-100 md:border-0">
          <span className="md:hidden text-xs font-bold text-gray-400">SCORE</span>
          <div className="flex flex-col md:gap-0.5 items-end md:items-start">
            <span className="font-serif font-bold text-lg md:text-sm text-[#171717] flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-yellow-500 hidden md:block" />
              {cast.score.toLocaleString()} <span className="text-[10px] text-gray-400 tracking-wider">pt</span>
            </span>
            <span className="text-[10px] font-bold text-yellow-600 bg-yellow-50/80 px-1.5 py-0.5 rounded flex items-center gap-1 w-fit border border-yellow-100">
              <Star className="w-2.5 h-2.5 fill-current" /> Lv.{cast.level}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex md:block items-center justify-between mt-3 md:mt-0">
           <span className="md:hidden text-xs font-bold text-gray-400">TAGS</span>
          {cast.quiz_tags && cast.quiz_tags.length > 0 ? (
            <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-2.5 py-1 md:px-0 md:bg-transparent rounded-lg">
              <Sparkles size={14} className="text-gray-400" />
              <span className="text-xs font-bold">{cast.quiz_tags.length} <span className="font-normal text-gray-400 hidden lg:inline">設定済み</span></span>
            </div>
          ) : (
            <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-200" /> 未設定
            </span>
          )}
        </div>

        {/* Status */}
        <div className="flex md:block items-center justify-between mt-3 md:mt-0">
           <span className="md:hidden text-xs font-bold text-gray-400">STATUS</span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 md:px-2 md:py-0.5 rounded-lg md:rounded text-xs font-bold uppercase tracking-wider transition-colors ${
              cast.is_active ?? cast.status === 'public'
                ? 'bg-green-50 text-green-700 border border-green-200 md:border-0'
                : 'bg-gray-50 text-gray-500 border border-gray-200 md:border-0'
            }`}
          >
            {cast.is_active ?? cast.status === 'public' ? (
              <><Eye size={12} className="md:w-2.5 md:h-2.5" /> <span className="mt-[1px]">公開</span></>
            ) : (
              <><EyeOff size={12} className="md:w-2.5 md:h-2.5" /> <span className="mt-[1px]">非公開</span></>
            )}
          </span>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex justify-end items-center gap-1">
          <Link
            href={`/admin/casts/${cast.id}`}
            className="p-2 text-gray-400 hover:text-[#171717] transition-all duration-200 rounded-lg hover:bg-gray-100"
            title="編集"
          >
             <Edit2 size={16} />
          </Link>
          <div className="text-gray-200 mx-1">|</div>
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
          <span className="text-sm font-bold text-gray-500 mr-2 border-r border-gray-200 pr-4">
            {selectedIds.size}件選択中
          </span>
          <button
            onClick={() => handleBulkStatus(true)}
            disabled={isPending}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors shadow-sm"
          >
            <Eye size={14} /> 一括公開
          </button>
          <button
            onClick={() => handleBulkStatus(false)}
            disabled={isPending}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <EyeOff size={14} /> 一括非公開
          </button>
          <button
            onClick={handleBulkDelete}
            disabled={isPending}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors shadow-sm sm:ml-2"
          >
            <Trash2 size={14} /> 一括削除
          </button>
        </div>

        <button
          onClick={saveOrder}
          disabled={isPending || showBulkActions}
          className="flex items-center justify-center gap-2 bg-[#171717] hover:bg-gold text-white px-6 py-2.5 text-sm font-bold tracking-wider transition-all duration-300 disabled:opacity-50 rounded-lg shadow-md hover:shadow-lg ml-auto w-full sm:w-auto"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isPending ? '保存中...' : '順番を保存する'}
        </button>
      </div>

      <div className="w-full">
        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-[auto_60px_2.5fr_1fr_1.5fr_1fr_1.5fr_auto] gap-6 px-6 py-4 mb-3 text-xs tracking-widest text-gray-400 font-bold uppercase items-center">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={toggleSelectAll}
              disabled={casts.length === 0}
              className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0 cursor-pointer transition-all"
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
              <div className="py-20 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                  <Star className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-[#171717] font-bold">対象のキャストが見つかりません</p>
                <p className="text-sm text-gray-400 mt-1">検索条件を変更するか、新しくキャストを登録してください。</p>
              </div>
            )}
          </div>
        </DndContext>
      </div>
    </div>
  );
}
