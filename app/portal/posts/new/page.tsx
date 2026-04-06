import { redirect } from 'next/navigation';

export const metadata = {
  title: 'キャスト日記 投稿 | Club Animo Portal',
};

export default function NewPostPage() {
  redirect('/cast/post');
}
