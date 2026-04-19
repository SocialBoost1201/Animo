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

// DESIGN.md gold gradient – applied inline to avoid purge issues
const goldGradientStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, #D1B25E 0%, #8F7130 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

// Shared grid template — header and row must match
const GRID_COLS = 'md:grid-cols-[auto_72px_3fr_1fr_1.6fr_1.2fr_1.6fr_auto]';

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

  const isPublic = cast.is_active ?? cast.status === 'public';
  const isElevated = isSelected || isDragging;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-[18px] transition-all duration-[180ms] font-sans ${
        isDragging ? 'scale-[1.02] -translate-y-[2px]' : ''
      }`}
    >
      {/* ── Layer 1: base (最背面) ── */}
      <div
        className="absolute inset-0 rounded-[18px]"
        style={{ background: '#232018', boxShadow: '2px 4px 10px rgba(0,0,0,0.5)' }}
      />

      {/* ── Layer 2: gold-back (奥の金) ── */}
      <div
        className={`absolute top-[3px] left-[3px] right-0 bottom-0 rounded-[18px] transition-all duration-[180ms] ${
          isElevated ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        style={{
          background:
            'linear-gradient(89deg, #E8AA00 1.17%, #FBD84B 18.26%, #E7AB00 56.27%, #FBD94D 77.43%, #EEB502 90.99%)',
        }}
      />

      {/* ── Layer 3: gold-accent (手前の金) ── */}
      <div
        className={`absolute top-[2px] left-[2px] right-0 bottom-0 rounded-[18px] transition-all duration-[180ms] ${
          isElevated
            ? 'opacity-100'
            : 'opacity-0 group-hover:opacity-100'
        }`}
        style={{
          background:
            'linear-gradient(89deg, rgba(232,170,0,0.70) 1.17%, rgba(251,216,75,0.70) 18.26%, rgba(231,171,0,0.70) 56.27%, rgba(251,217,77,0.70) 77.43%, rgba(238,181,2,0.70) 90.99%)',
          boxShadow: isElevated
            ? '1px 1px 28px rgba(236,203,71,0.45)'
            : '1px 1px 20px rgba(236,203,71,0.3)',
        }}
      />

      {/* ── Layer 4: surface (前面の黒い鏡面) ── */}
      <div
        className="absolute top-[1px] left-[1px] right-0 bottom-0 rounded-[18px] transition-all duration-[180ms]"
        style={{
          background:
            'linear-gradient(1deg, #282727 7.95%, #191717 27.54%, #191717 79.4%, #393939 118.24%, #191717 127.8%)',
        }}
      />
      {/* ── Content (z-index above all layers) ── */}
      <div className="relative z-[2]">

      {/* ── Mobile Top Controls ── */}
      <div className="flex justify-between items-start md:hidden p-4 pb-0">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(cast.id)}
            className="w-5 h-5 rounded border-[#ffffff20] bg-white/5 accent-[#dfbd69] cursor-pointer"
          />
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-2 rounded-lg text-[#5a5650] hover:text-[#dfbd69] hover:bg-white/5 transition-colors"
          >
            <GripVertical size={20} />
          </div>
        </label>
        <div className="flex items-center gap-1">
          <Link
            href={`/admin/human-resources/${cast.id}`}
            className="p-2 text-[#5a5650] hover:text-[#dfbd69] transition-all rounded-lg hover:bg-white/5"
          >
            <Edit2 size={18} />
          </Link>
          <DeleteCastButton castId={cast.id} castName={cast.stage_name || cast.name || '名前なし'} />
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className={`flex flex-col md:grid ${GRID_COLS} md:items-center gap-4 md:gap-0 p-4 md:p-0 md:px-5 md:py-4`}>

        {/* Desktop: Checkbox + Grip */}
        <div className="hidden md:flex items-center gap-2 pl-1">
          <label className="cursor-pointer">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(cast.id)}
              className="w-4 h-4 rounded border-[#ffffff18] bg-white/5 accent-[#dfbd69] cursor-pointer"
            />
          </label>
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg text-[#5a5650] hover:text-[#dfbd69] hover:bg-white/5 transition-all opacity-30 group-hover:opacity-80"
          >
            <GripVertical size={16} />
          </div>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4 md:contents">
          <div className="w-14 h-14 md:w-[52px] md:h-[52px] rounded-full overflow-hidden bg-[#1e1b16] border border-[#dfbd69]/20 shrink-0 shadow-lg relative group-hover:border-[#dfbd69]/40 transition-all duration-500 md:my-0">
            {cast.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cast.image_url}
                alt={cast.stage_name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#8a7850] text-lg font-serif">
                {(cast.stage_name || cast.name || '?')[0]}
              </div>
            )}
          </div>

          {/* Name & Hobby (mobile: inline with avatar) */}
          <div className="flex-1 min-w-0 md:hidden">
            <p className="font-bold text-[#f4f1ea] text-base truncate tracking-tight">
              {cast.stage_name || cast.name}
            </p>
            {cast.hobby && (
              <p className="text-[12px] text-[#5a5650] truncate mt-0.5">{cast.hobby}</p>
            )}
          </div>
        </div>

        {/* Name & Hobby (Desktop) */}
        <div className="hidden md:block min-w-0 pl-3">
          <p className="font-bold text-[15px] text-[#f4f1ea] truncate tracking-tight group-hover:text-[#dfbd69] transition-colors duration-200">
            {cast.stage_name || cast.name}
          </p>
          {cast.hobby && (
            <p className="text-[12px] text-[#5a5650] truncate mt-0.5">{cast.hobby}</p>
          )}
        </div>

        {/* Age */}
        <div className="hidden md:block text-[14px] font-semibold text-[#8a8478] pl-2">
          {cast.age ? `${cast.age}歳` : <span className="text-[#3a3830]">—</span>}
        </div>

        {/* Score & Level */}
        <div className="flex md:flex-col items-center md:items-start justify-between md:justify-center gap-2 md:gap-1.5 py-3 md:py-0 border-t border-[#ffffff06] md:border-0 pl-0 md:pl-1">
          <span className="md:hidden text-[10px] font-bold text-[#3a3830] tracking-widest">SCORE</span>
          <div className="flex flex-col md:gap-1.5 items-end md:items-start">
            <span className="font-bold text-[18px] md:text-[16px] flex items-center gap-1.5" style={goldGradientStyle}>
              <Trophy className="w-3.5 h-3.5 text-[#dfbd69] hidden md:block shrink-0" style={{ WebkitTextFillColor: 'initial' }} />
              {cast.score.toLocaleString()}
              <span className="text-[10px] text-[#5a5650] tracking-wider uppercase font-sans font-black" style={{ WebkitTextFillColor: '#5a5650', background: 'none' }}>pt</span>
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 w-fit border bg-[#dfbd69]/10 text-[#dfbd69] border-[#dfbd69]/20">
              <Star className="w-2.5 h-2.5 fill-current" />
              LEVEL {cast.level}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex md:block items-center justify-between py-2 md:py-0 md:pl-1">
          <span className="md:hidden text-[10px] font-bold text-[#3a3830] tracking-widest">TAGS</span>
          {cast.quiz_tags && cast.quiz_tags.length > 0 ? (
            <div className="flex items-center gap-1.5 text-[#c7c0b2]">
              <Sparkles size={13} className="text-[#dfbd69]/60 shrink-0" />
              <span className="text-[13px] font-bold">
                {cast.quiz_tags.length}
                <span className="font-normal text-[#5a5650] hidden lg:inline ml-1">項目設定済み</span>
              </span>
            </div>
          ) : (
            <span className="text-[12px] text-[#3a3830] flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ffffff08]" />
              未設定
            </span>
          )}
        </div>

        {/* Status */}
        <div className="flex md:block items-center justify-between py-2 md:py-0">
          <span className="md:hidden text-[10px] font-bold text-[#3a3830] tracking-widest">STATUS</span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.8px] transition-all ${
              isPublic
                ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_8px_rgba(74,222,128,0.08)]'
                : 'bg-[#1a1c22] text-[#4a4a52] border border-[#ffffff08]'
            }`}
          >
            {isPublic ? (
              <><Eye size={11} strokeWidth={2.5} /><span>PUBLIC</span></>
            ) : (
              <><EyeOff size={11} strokeWidth={2.5} /><span>PRIVATE</span></>
            )}
          </span>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex justify-end items-center gap-1 pr-2">
          <Link
            href={`/admin/human-resources/${cast.id}`}
            className="p-2 text-[#4a4845] hover:text-[#dfbd69] transition-all duration-200 rounded-lg hover:bg-white/5"
            title="編集"
          >
            <Edit2 size={16} />
          </Link>
          <div className="w-px h-4 bg-[#ffffff08] mx-1" />
          <DeleteCastButton castId={cast.id} castName={cast.stage_name || cast.name || '名前なし'} />
        </div>

      </div>
      </div>{/* end z-[2] content wrapper */}
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
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCasts((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          display_order: index + 1,
        }));
      });
    }
  };

  const saveOrder = () => {
    startTransition(async () => {
      const orders = casts.map((c) => ({ id: c.id, display_order: c.display_order }));
      const result = await updateCastOrder(orders);
      if (result.error) toast.error(result.error);
      else toast.success('表示順を保存しました');
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds(
      selectedIds.size === casts.length ? new Set() : new Set(casts.map((c) => c.id))
    );
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) { next.delete(id); } else { next.add(id); }
    setSelectedIds(next);
  };

  const handleBulkStatus = (isActive: boolean) => {
    if (selectedIds.size === 0) return;
    startTransition(async () => {
      const result = await bulkUpdateCastsStatus(Array.from(selectedIds), isActive);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${selectedIds.size}人のステータスを更新しました`);
        setCasts(casts.map((c) =>
          selectedIds.has(c.id) ? { ...c, is_active: isActive, status: isActive ? 'public' : 'private' } : c
        ));
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
        setCasts(casts.filter((c) => !selectedIds.has(c.id)));
        setSelectedIds(new Set());
      }
    });
  };

  const isAllSelected = casts.length > 0 && selectedIds.size === casts.length;
  const showBulkActions = selectedIds.size > 0;

  return (
    <div className="space-y-4">

      {/* ── Operation Bar ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 min-h-[40px]">

        {/* Bulk Actions */}
        <div
          className={`flex flex-wrap items-center gap-2 transition-all duration-200 ${
            showBulkActions ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none -translate-y-1'
          }`}
        >
          <span className="text-[12px] font-bold text-[#5a5650] border-r border-[#ffffff0f] pr-4 mr-1">
            {selectedIds.size}件選択中
          </span>
          <button
            onClick={() => handleBulkStatus(true)}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold text-green-400 bg-green-500/8 border border-green-500/20 rounded-lg hover:bg-green-500/15 transition-colors"
          >
            <Eye size={12} /> 一括公開
          </button>
          <button
            onClick={() => handleBulkStatus(false)}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold text-[#8a8478] bg-white/4 border border-white/8 rounded-lg hover:bg-white/8 transition-colors"
          >
            <EyeOff size={12} /> 一括非公開
          </button>
          <button
            onClick={handleBulkDelete}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold text-red-400 bg-red-500/8 border border-red-500/20 rounded-lg hover:bg-red-500/15 transition-colors sm:ml-2"
          >
            <Trash2 size={12} /> 一括削除
          </button>
        </div>

        {/* Save Order — hidden while bulk actions are shown */}
        {!showBulkActions && (
          <button
            onClick={saveOrder}
            disabled={isPending}
            className="flex items-center justify-center gap-2 bg-[#18171400] border border-[#ffffff0c] hover:border-[#dfbd69]/40 text-[#8a8478] hover:text-[#dfbd69] px-5 py-2 text-[12px] font-bold tracking-wider transition-all duration-200 disabled:opacity-40 rounded-[10px] ml-auto"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {isPending ? '保存中...' : '順番を保存する'}
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div className="w-full">

        {/* Desktop Header */}
        <div className={`hidden md:grid ${GRID_COLS} gap-0 px-5 py-3 mb-2 text-[10px] tracking-[0.12em] text-[#3a3830] font-bold uppercase items-center border-b border-[#ffffff06]`}>
          <label className="flex items-center gap-2 cursor-pointer pl-1">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={toggleSelectAll}
              disabled={casts.length === 0}
              className="w-3.5 h-3.5 rounded border-[#ffffff15] bg-white/5 accent-[#dfbd69] cursor-pointer"
            />
          </label>
          <div className="text-center">IMG</div>
          <div className="pl-3">CAST NAME</div>
          <div className="pl-2">AGE</div>
          <div className="pl-1">SCORE / RANK</div>
          <div className="pl-1">TAGS</div>
          <div>STATUS</div>
          <div className="text-right pr-2">ACTIONS</div>
        </div>

        {/* Drag & Drop List */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="space-y-2">
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

            {casts.length === 0 && (
              <div className="py-20 text-center rounded-[18px] border border-dashed border-[#ffffff08] bg-[#0f0e0c]">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#dfbd69]/15 bg-[#dfbd69]/5">
                  <Star className="w-5 h-5 text-[#dfbd69]/40" />
                </div>
                <p className="text-[14px] font-bold text-[#8a8478]">対象のキャストが見つかりません</p>
                <p className="text-[12px] text-[#4a4845] mt-1.5">検索条件を変更するか、新しくキャストを登録してください。</p>
              </div>
            )}
          </div>
        </DndContext>
      </div>
    </div>
  );
}
