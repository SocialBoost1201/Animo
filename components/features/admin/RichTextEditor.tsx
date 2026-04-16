'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Strikethrough, List, ListOrdered, Quote, RotateCcw, RotateCw } from 'lucide-react';
import { useEffect } from 'react';
import type { Editor } from '@tiptap/react';

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-white/3 border-b border-white/5">
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded-sm transition-all ${editor.isActive('bold') ? 'bg-gold text-black' : 'text-[#8a8478] hover:bg-white/10 hover:text-[#f4f1ea]'}`}
        title="太字"
      >
        <Bold size={14} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded-sm transition-all ${editor.isActive('italic') ? 'bg-gold text-black' : 'text-[#8a8478] hover:bg-white/10 hover:text-[#f4f1ea]'}`}
        title="斜体"
      >
        <Italic size={14} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-2 rounded-sm transition-all ${editor.isActive('strike') ? 'bg-gold text-black' : 'text-[#8a8478] hover:bg-white/10 hover:text-[#f4f1ea]'}`}
        title="取り消し線"
      >
        <Strikethrough size={14} />
      </button>

      <div className="w-px h-5 bg-white/5 mx-1" />

      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
        className={`px-2 py-1.5 rounded-sm transition-all font-bold text-[10px] tracking-tighter leading-none ${editor.isActive('heading', { level: 2 }) ? 'bg-gold text-black' : 'text-[#8a8478] hover:bg-white/10 hover:text-[#f4f1ea]'}`}
        title="見出し2"
      >
        H2
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }}
        className={`px-2 py-1.5 rounded-sm transition-all font-bold text-[10px] tracking-tighter leading-none ${editor.isActive('heading', { level: 3 }) ? 'bg-gold text-black' : 'text-[#8a8478] hover:bg-white/10 hover:text-[#f4f1ea]'}`}
        title="見出し3"
      >
        H3
      </button>

      <div className="w-px h-5 bg-white/5 mx-1" />

      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
        className={`p-2 rounded-sm transition-all ${editor.isActive('bulletList') ? 'bg-gold text-black' : 'text-[#8a8478] hover:bg-white/10 hover:text-[#f4f1ea]'}`}
        title="箇条書きリスト"
      >
        <List size={14} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
        className={`p-2 rounded-sm transition-all ${editor.isActive('orderedList') ? 'bg-gold text-black' : 'text-[#8a8478] hover:bg-white/10 hover:text-[#f4f1ea]'}`}
        title="番号付きリスト"
      >
        <ListOrdered size={14} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
        className={`p-2 rounded-sm transition-all ${editor.isActive('blockquote') ? 'bg-gold text-black' : 'text-[#8a8478] hover:bg-white/10 hover:text-[#f4f1ea]'}`}
        title="引用"
      >
        <Quote size={14} />
      </button>

      <div className="flex-1" />

      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().undo().run(); }}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 rounded-sm text-[#5a5650] hover:text-[#f4f1ea] hover:bg-white/10 disabled:opacity-20 transition-all"
        title="元に戻す"
      >
        <RotateCcw size={14} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().redo().run(); }}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 rounded-sm text-[#5a5650] hover:text-[#f4f1ea] hover:bg-white/10 disabled:opacity-20 transition-all"
        title="やり直し"
      >
        <RotateCw size={14} />
      </button>
    </div>
  );
};

export function RichTextEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm prose-invert max-w-none focus:outline-none min-h-[200px] p-4 bg-black/95 prose-p:my-1 prose-headings:my-2 prose-ul:my-1 text-[#f4f1ea]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // 外部からの content 変更（初期値セットなど）をエディタに反映する
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content && editor.getHTML() === '<p></p>') {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="border border-white/10 rounded overflow-hidden shadow-2xl">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
