/**
 * Google Analytics (GA4) Custom Event Tracking Utility
 * 
 * イベント設計に基づくカスタム計測関数を提供します。
 * GA4がロードされていない環境（SSRや未設定時）でもエラーにならないようハンドリングしています。
 */

// グローバルな window.gtag の型定義
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * 汎用のイベント送信関数
 * @param eventName アナリティクスのイベント名
 * @param params イベントに付与するパラメータ
 */
export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

/**
 * カスタムイベント：キャスト詳細閲覧 (`cast_detail_view`)
 */
export const trackCastView = (castName: string, castId: string) => {
  trackEvent('cast_detail_view', {
    cast_name: castName,
    cast_id: castId,
  });
};

/**
 * カスタムイベント：求人応募ボタンクリック (`recruit_apply_click`)
 */
export const trackRecruitClick = (recruitType: 'cast' | 'staff') => {
  trackEvent('recruit_apply_click', {
    recruit_type: recruitType,
  });
};

/**
 * カスタムイベント：求人応募送信完了 (`recruit_submit`)
 */
export const trackRecruitSubmit = (recruitType: 'cast' | 'staff') => {
  trackEvent('recruit_submit', {
    recruit_type: recruitType,
    device_type: getDeviceType(),
  });
};

/**
 * カスタムイベント：問い合わせ（予約）送信完了 (`contact_submit`)
 */
export const trackContactSubmit = () => {
  trackEvent('contact_submit', {
    device_type: getDeviceType(),
  });
};

/**
 * カスタムイベント：CTA（Call To Action）クリック (`cta_click`)
 */
export const trackCtaClick = (ctaName: string) => {
  trackEvent('cta_click', {
    cta_name: ctaName,
  });
};

/**
 * デバイスタイプ判定の補助関数
 */
function getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = window.navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}
