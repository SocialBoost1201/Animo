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
    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'bg-gray-200 text-black' : 'text-gray-600 hover:bg-gray-200'}`}
        title="太字"
      >
        <Bold size={16} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'bg-gray-200 text-black' : 'text-gray-600 hover:bg-gray-200'}`}
        title="斜体"
      >
        <Italic size={16} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('strike') ? 'bg-gray-200 text-black' : 'text-gray-600 hover:bg-gray-200'}`}
        title="取り消し線"
      >
        <Strikethrough size={16} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
        className={`p-1.5 rounded transition-colors font-bold text-sm leading-none ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-black' : 'text-gray-600 hover:bg-gray-200'}`}
        title="見出し2"
      >
        H2
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }}
        className={`p-1.5 rounded transition-colors font-bold text-sm leading-none ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-black' : 'text-gray-600 hover:bg-gray-200'}`}
        title="見出し3"
      >
        H3
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
        className={`p-1.5 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-gray-200 text-black' : 'text-gray-600 hover:bg-gray-200'}`}
        title="箇条書きリスト"
      >
        <List size={16} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
        className={`p-1.5 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-gray-200 text-black' : 'text-gray-600 hover:bg-gray-200'}`}
        title="番号付きリスト"
      >
        <ListOrdered size={16} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
        className={`p-1.5 rounded transition-colors ${editor.isActive('blockquote') ? 'bg-gray-200 text-black' : 'text-gray-600 hover:bg-gray-200'}`}
        title="引用"
      >
        <Quote size={16} />
      </button>

      <div className="flex-1" />

      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().undo().run(); }}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-1.5 rounded text-gray-500 hover:text-black hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent"
        title="元に戻す"
      >
        <RotateCcw size={16} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().redo().run(); }}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-1.5 rounded text-gray-500 hover:text-black hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent"
        title="やり直し"
      >
        <RotateCw size={16} />
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
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4 bg-white prose-p:my-1 prose-headings:my-2 prose-ul:my-1 text-[#171717]',
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
    <div className="border border-gray-300 rounded overflow-hidden shadow-sm">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
