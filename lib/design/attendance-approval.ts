/**
 * 出勤調整＆承認 ページ デザイントークン
 * Source of truth for all visual styles in /admin/shift-requests
 */
export const attendanceApprovalDesign = {
  radius: {
    panel: '20px',
    card: '20px',
    tab: '20px',
    button: '17px',
    summaryBadge: '70px',
    pill: '9999px',
  },
  border: {
    gold: 'hsla(38, 45%, 43%, 1)',
    lightGold: 'hsla(35, 68%, 75%, 1)',
  },
  text: {
    white: 'hsla(0, 0%, 100%, 1)',
    black: 'hsla(0, 0%, 0%, 1)',
    softWhite: 'rgba(255,255,255,0.92)',
  },
  gradients: {
    categoryNewSubmit:
      'linear-gradient(91deg, hsla(38,68%,31%,1) 0%, hsla(39,63%,61%,1) 45%, hsla(39,69%,31%,1) 100%)',
    categoryChangeRequest:
      'linear-gradient(92deg, hsla(234,89%,35%,1) 0%, hsla(234,77%,39%,0.57) 25%, hsla(234,72%,20%,1) 55%, hsla(234,69%,36%,0.9) 80%, hsla(234,89%,14%,1) 100%)',
    categoryStoreRecruit:
      'linear-gradient(92deg, hsla(276,55%,31%,1) 0%, hsla(276,62%,38%,1) 22%, hsla(276,61%,27%,1) 45%, hsla(276,65%,44%,1) 78%, hsla(276,62%,19%,1) 100%)',
    statusPending:
      'linear-gradient(90deg, hsla(20,73%,32%,1) 0%, hsla(20,81%,48%,1) 25%, hsla(20,76%,32%,1) 55%, hsla(20,71%,49%,1) 78%, hsla(20,79%,32%,1) 100%)',
    statusApproved:
      'linear-gradient(92deg, hsla(118,62%,34%,1) 0%, hsla(119,60%,32%,1) 25%, hsla(121,48%,27%,1) 52%, hsla(126,66%,35%,1) 78%, hsla(127,62%,29%,1) 100%)',
    statusAll:
      'linear-gradient(91deg, hsla(0,0%,21%,1) 0%, hsla(0,0%,34%,1) 25%, hsla(0,1%,38%,1) 50%, hsla(0,0%,25%,1) 75%, hsla(0,0%,21%,1) 100%)',
    ctaGold:
      'linear-gradient(167deg, hsla(38,63%,53%,1) 0%, hsla(43,65%,64%,1) 24%, hsla(43,61%,57%,1) 45%, hsla(43,68%,43%,1) 100%)',
    rejectSilver:
      'linear-gradient(266deg, hsla(0,0%,80%,1) 0%, hsla(0,0%,40%,1) 45%, hsla(0,0%,66%,1) 100%)',
    summaryRed:
      'linear-gradient(185deg, hsla(0,92%,37%,1) 0%, hsla(0,92%,22%,1) 22%, hsla(359,66%,71%,1) 50%, hsla(0,92%,29%,1) 72%, hsla(0,92%,16%,1) 100%)',
    cardBg:
      'linear-gradient(180deg, hsla(0,0%,0%,1) 0%, hsla(0,0%,8%,1) 40%, hsla(220,20%,12%,1) 100%)',
    pageBg: 'linear-gradient(180deg, #242424 0%, #171717 100%)',
  },
  font: {
    mincho: 'Hiragino Mincho ProN, Yu Mincho, YuMincho, serif',
    sans: 'Inter, sans-serif',
  },
} as const;

export const D = attendanceApprovalDesign;
