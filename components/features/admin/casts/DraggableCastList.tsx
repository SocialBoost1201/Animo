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
import { Edit2, Eye, EyeOff, Sparkles, GripVertical, Save, Loader2, Trash2, Plus, Star } from 'lucide-react';
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
    zIndex: isDragging ? 10 : 1,
    boxShadow: isDragging ? '0px 4px 12px rgba(0,0,0,0.1)' : 'none',
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`hover:bg-gray-50/50 transition-colors ${isDragging ? 'bg-white' : ''} ${isSelected ? 'bg-amber-50/30' : ''}`}
    >
      <td className="px-6 py-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(cast.id)}
            className="w-4 h-4 rounded-sm border-gray-300 text-gold focus:ring-gold focus:ring-offset-0 cursor-pointer"
          />
          {/* ドラッグハンドル */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:bg-gray-100 p-2 rounded text-gray-400 hover:text-[#171717] transition-colors inline-block -ml-2"
          >
            <GripVertical size={16} />
          </div>
        </label>
      </td>
      <td className="px-6 py-4">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
          {cast.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cast.image_url} alt={cast.stage_name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
              {(cast.stage_name || cast.name || '?')[0]}
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="font-bold text-[#171717]">{cast.stage_name || cast.name}</p>
        {cast.hobby && <p className="text-xs text-gray-400 mt-0.5">趣味: {cast.hobby}</p>}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {cast.age ? `${cast.age}歳` : '-'}
      </td>
      <td className="px-6 py-4">
        {cast.quiz_tags && cast.quiz_tags.length > 0 ? (
          <div className="flex items-center gap-1.5 text-gold">
            <Sparkles size={14} />
            <span className="text-xs font-bold">{cast.quiz_tags.length} tags</span>
          </div>
        ) : (
          <span className="text-[10px] text-gray-300 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-200" /> 未設定
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
            cast.is_active ?? cast.status === 'public'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {cast.is_active ?? cast.status === 'public' ? (
            <><Eye size={10} /> 公開</>
          ) : (
            <><EyeOff size={10} /> 非公開</>
          )}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end items-center gap-2 relative z-20">
          <Link
            href={`/admin/casts/${cast.id}`}
            className="p-2 text-gray-400 hover:text-[#171717] transition-colors rounded hover:bg-gray-100"
          >
            <Edit2 size={16} />
          </Link>
          <DeleteCastButton castId={cast.id} castName={cast.stage_name || cast.name || '名前なし'} />
        </div>
      </td>
    </tr>
  );
}

export function DraggableCastList({ initialCasts }: { initialCasts: CastType[] }) {
  const [casts, setCasts] = useState(initialCasts);
  // DBエラー等は Server Actions 内でスローしているため未使用になっています
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
        
        // ローカルで display_order を振り直す
        return newArray.map((item, index) => ({
           ...item,
           display_order: index + 1 // 1からの連番など
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
    <div className="space-y-4">
      {/* 操作ヘッダー */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-h-[44px]">
        {/* 一括操作パネル */}
        <div className={`flex items-center gap-2 transition-opacity duration-200 ${showBulkActions ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <span className="text-sm font-bold text-gray-500 mr-2 border-r border-gray-200 pr-4">
            {selectedIds.size}件選択中
          </span>
          <button
            onClick={() => handleBulkStatus(true)}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors"
          >
            <Eye size={14} /> 一括公開
          </button>
          <button
            onClick={() => handleBulkStatus(false)}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors"
          >
            <EyeOff size={14} /> 一括非公開
          </button>
          <button
            onClick={handleBulkDelete}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors ml-2"
          >
            <Trash2 size={14} /> 一括削除
          </button>
        </div>

        <button
          onClick={saveOrder}
          disabled={isPending || showBulkActions}
          className="flex items-center gap-2 bg-[#171717] hover:bg-gold text-white px-5 py-2.5 text-sm font-bold tracking-wider transition-all duration-200 disabled:opacity-60 rounded-sm ml-auto"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isPending ? '保存中...' : '順番を保存'}
        </button>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs tracking-widest text-gray-500 uppercase">
              <th className="px-6 py-4 font-bold w-16">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    disabled={casts.length === 0}
                    className="w-4 h-4 rounded-sm border-gray-300 text-gold focus:ring-gold focus:ring-offset-0 cursor-pointer"
                  />
                  <span>順</span>
                </label>
              </th>
              <th className="px-6 py-4 font-bold">Image</th>
              <th className="px-6 py-4 font-bold">源氏名</th>
              <th className="px-6 py-4 font-bold">年齢</th>
              <th className="px-6 py-4 font-bold">診断</th>
              <th className="px-6 py-4 font-bold">在籍</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <tbody className="divide-y divide-gray-50">
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
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                    対象のキャストが見つかりません。
                  </td>
                </tr>
              )}
            </tbody>
          </DndContext>
        </table>
      </div>
    </div>
  );
}
