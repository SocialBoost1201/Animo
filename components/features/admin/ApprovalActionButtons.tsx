'use client';

import { useActionState, useEffect, useRef, Component } from 'react';
import type { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import type { ApprovalActionState } from '@/lib/types/approval-action';
import { showToast } from '@/components/ui/Toast';

// ── ボタン ───────────────────────────────────────────────────────────────────

function ApproveBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center h-8 text-[11px] font-bold rounded-[8px] bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] text-[#0b0b0d] hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {pending ? <Loader2 size={12} className="animate-spin" /> : '承認'}
    </button>
  );
}

function RejectBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center h-8 text-[11px] font-bold rounded-[8px] border border-[#c8823226] bg-[#c882321a] text-[#c8884d] hover:bg-[#c8823230] transition-colors disabled:opacity-50"
    >
      {pending ? <Loader2 size={12} className="animate-spin text-[#c8884d]" /> : '却下'}
    </button>
  );
}

// ── ErrorBoundary ────────────────────────────────────────────────────────────
// Server Action が throw した場合（予期せぬ例外）を捕捉し、
// ページ全体のクラッシュを防いでリトライボタンを表示する。

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class ApprovalErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const message =
      error instanceof Error ? error.message : '予期せぬエラーが発生しました';
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown) {
    console.error('[ApprovalErrorBoundary] Server Action threw:', error);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col gap-2 pt-0.5">
          <div className="flex items-start gap-2 rounded-[8px] border border-red-900/40 bg-red-950/30 px-3 py-2">
            <AlertCircle size={13} className="shrink-0 mt-0.5 text-red-400" />
            <p className="text-[11px] text-red-300 leading-snug flex-1">
              {this.state.message}
            </p>
          </div>
          <button
            type="button"
            onClick={this.handleReset}
            className="flex w-full items-center justify-center gap-1.5 h-7 text-[11px] font-medium rounded-[8px] border border-[#ffffff10] text-[#8a8478] hover:text-[#c7c0b2] transition-colors"
          >
            <RotateCcw size={11} />
            再試行
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── メインコンポーネント ────────────────────────────────────────────────────

type ApprovalAction = (
  prev: ApprovalActionState,
  formData: FormData,
) => Promise<ApprovalActionState>;

/**
 * 承認ハブで使う承認・却下ボタンペア。
 *
 * - useActionState で Server Action の結果（成功/失敗）を受け取る
 * - 成功時・失敗時ともにトースト通知を表示する
 * - Server Action が throw した場合は ErrorBoundary が捕捉してリトライボタンを表示
 * - 成功時は Server Action 側の revalidatePath で一覧から消える
 */
export function ApprovalActionPair({
  id,
  approveAction,
  rejectAction,
}: {
  id: string;
  approveAction: ApprovalAction;
  rejectAction: ApprovalAction;
}) {
  return (
    <ApprovalErrorBoundary>
      <ApprovalActionPairInner
        id={id}
        approveAction={approveAction}
        rejectAction={rejectAction}
      />
    </ApprovalErrorBoundary>
  );
}

function ApprovalActionPairInner({
  id,
  approveAction,
  rejectAction,
}: {
  id: string;
  approveAction: ApprovalAction;
  rejectAction: ApprovalAction;
}) {
  const [approveState, approveFormAction] = useActionState<ApprovalActionState, FormData>(
    approveAction,
    null,
  );
  const [rejectState, rejectFormAction] = useActionState<ApprovalActionState, FormData>(
    rejectAction,
    null,
  );

  // 前回の state を保持して「状態が変化したとき」だけトースト発火
  const prevApprove = useRef<ApprovalActionState>(null);
  const prevReject = useRef<ApprovalActionState>(null);

  useEffect(() => {
    if (approveState === null || approveState === prevApprove.current) return;
    prevApprove.current = approveState;

    if (approveState.success) {
      showToast('承認しました', 'success');
    } else {
      showToast(`承認に失敗しました: ${approveState.error}`, 'error');
    }
  }, [approveState]);

  useEffect(() => {
    if (rejectState === null || rejectState === prevReject.current) return;
    prevReject.current = rejectState;

    if (rejectState.success) {
      showToast('却下しました', 'success');
    } else {
      showToast(`却下に失敗しました: ${rejectState.error}`, 'error');
    }
  }, [rejectState]);

  // 失敗時のインラインエラー（トーストに加えてボタン下にも表示）
  const errorMessage =
    (approveState && approveState.success === false ? approveState.error : null) ??
    (rejectState && rejectState.success === false ? rejectState.error : null);

  return (
    <div className="flex flex-col gap-1 pt-0.5">
      <div className="flex gap-2">
        <form action={approveFormAction} className="flex-1">
          <input type="hidden" name="id" value={id} />
          <ApproveBtn />
        </form>
        <form action={rejectFormAction} className="flex-1">
          <input type="hidden" name="id" value={id} />
          <RejectBtn />
        </form>
      </div>
      {errorMessage && (
        <div className="flex items-center gap-1.5 px-1">
          <AlertCircle size={11} className="shrink-0 text-[#c8884d]" />
          <p
            role="alert"
            className="text-[10px] leading-tight text-[#c8884d] font-medium"
          >
            {errorMessage}
          </p>
        </div>
      )}
    </div>
  );
}
