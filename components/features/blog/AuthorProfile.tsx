import React from 'react';
import { UserCheck } from 'lucide-react';

interface AuthorProfileProps {
  name?: string;
  role?: string;
  description?: string;
}

export const AuthorProfile: React.FC<AuthorProfileProps> = ({
  name = 'CLUB Animo 編集部',
  role = '関内高級キャバクラ ナイトライフアドバイザー',
  description = '関内・馬車道エリアで長年培った知見をもとに、初めての方から接待まで、最適なナイトライフの楽しみ方をご提案します。明朗会計と上質なサービスを第一に、有益な情報をお届けします。',
}) => {
  return (
    <div className="mt-16 bg-foreground border border-white/10 rounded-xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gold/20 flex items-center justify-center shrink-0 border border-gold/40">
          <UserCheck className="w-8 h-8 md:w-10 md:h-10 text-gold" />
        </div>
        <div>
          <h4 className="text-sm font-serif text-gold tracking-widest uppercase mb-1">
            {role}
          </h4>
          <p className="text-xl md:text-2xl font-serif text-white mb-3 tracking-wider">
            この記事の監修・執筆: {name}
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
