export type CastPostStatus = 'published' | 'pending' | 'draft';

export type CastPostCard = {
  id: string;
  image_url: string;
  content: string | null;
  created_at: string;
  status: CastPostStatus | string;
};

export type CastPostWithAuthor = CastPostCard & {
  casts?: {
    slug?: string | null;
    stage_name?: string | null;
    name?: string | null;
  } | null;
};

export type CastScoreLog = {
  id: string;
  description: string;
  points_delta: number;
  created_at: string;
};
