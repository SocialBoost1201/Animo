HTML
<div class="kpi-grid">
  <div class="kpi-card kpi-card--default">
    <div class="kpi-card__base"></div>
    <div class="kpi-card__gold-back"></div>
    <div class="kpi-card__gold-accent"></div>
    <div class="kpi-card__surface"></div>

    <div class="kpi-card__icon">👥</div>

    <div class="kpi-card__content">
      <div class="kpi-card__title">本日の出勤人数</div>
      <div class="kpi-card__value">14</div>
      <div class="kpi-card__sub">確定 11名 / 未確定 3名</div>
    </div>
  </div>

  <div class="kpi-card kpi-card--highlighted">
    <div class="kpi-card__base"></div>
    <div class="kpi-card__gold-back"></div>
    <div class="kpi-card__gold-accent"></div>
    <div class="kpi-card__surface"></div>

    <div class="kpi-card__icon">📅</div>

    <div class="kpi-card__content">
      <div class="kpi-card__title">来店予定件数</div>
      <div class="kpi-card__value">8</div>
      <div class="kpi-card__sub">予定人数 19名</div>
    </div>
  </div>
</div> 

CSS

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(6, 183px);
  gap: 16px;
}

.kpi-card {
  position: relative;
  width: 183px;
  height: 151px;
  border-radius: 18px;
  overflow: visible;
  cursor: pointer;
  transition:
    transform 180ms ease,
    filter 180ms ease;
}

/* 土台 */
.kpi-card__base {
  position: absolute;
  inset: 0;
  border-radius: 18px;
  background: #393939;
  box-shadow: 2px 4px 10px rgba(0,0,0,0.5);
}

/* 奥の金 */
.kpi-card__gold-back {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 180px;
  height: 148px;
  border-radius: 18px;
  background:
    radial-gradient(
      50% 50% at 50% 50%,
      rgba(253,224,91,0.20) 0%,
      rgba(251,222,91,0.20) 100%
    ),
    linear-gradient(
      89deg,
      #E8AA00 1.17%,
      #FBD84B 18.26%,
      #E7AB00 56.27%,
      #FBD94D 77.43%,
      #EEB502 90.99%
    );
  transition:
    transform 180ms ease,
    filter 180ms ease,
    opacity 180ms ease;
}

/* 手前の金 */
.kpi-card__gold-accent {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 180px;
  height: 148px;
  border-radius: 18px;
  background:
    radial-gradient(
      50% 50% at 50% 50%,
      rgba(253,224,91,0.10) 0%,
      rgba(251,222,91,0.10) 100%
    ),
    linear-gradient(
      89deg,
      rgba(232,170,0,0.70) 1.17%,
      rgba(251,216,75,0.70) 18.26%,
      rgba(231,171,0,0.70) 56.27%,
      rgba(251,217,77,0.70) 77.43%,
      rgba(238,181,2,0.70) 90.99%
    );
  box-shadow: 1px 1px 20px rgba(236,203,71,0.3);
  transition:
    transform 180ms ease,
    filter 180ms ease,
    opacity 180ms ease,
    box-shadow 180ms ease;
}

/* 前面の黒い鏡面 */
.kpi-card__surface {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 178px;
  height: 146px;
  border-radius: 18px;
  background: linear-gradient(
    1deg,
    #282727 7.95%,
    #191717 27.54%,
    #191717 79.4%,
    #393939 118.24%,
    #191717 127.8%
  );
  transition:
    transform 180ms ease,
    filter 180ms ease;
}

/* コンテンツ */
.kpi-card__content {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  text-align: center;
}

.kpi-card__title {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 500;
  line-height: 15.4px;
  letter-spacing: 0.064px;
  color: #8A8478;
  margin-bottom: 8px;
}

.kpi-card__value {
  font-family: Inter, sans-serif;
  font-size: 30px;
  font-weight: 700;
  line-height: 30px;
  letter-spacing: -0.204px;
  background: linear-gradient(90deg, #D1B25E 0%, #8F7130 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.kpi-card__sub {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 400;
  line-height: 15.4px;
  letter-spacing: 0.064px;
  color: #8A8478;
}

.kpi-card__icon {
  position: absolute;
  top: 18px;
  right: 18px;
  z-index: 3;
  color: #D6B85A;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* default */
.kpi-card--default .kpi-card__gold-back {
  opacity: 1;
}

.kpi-card--default .kpi-card__gold-accent {
  opacity: 1;
}

/* hover */
.kpi-card:hover {
  transform: translateY(-2px);
}

.kpi-card:hover .kpi-card__gold-back {
  transform: translate(4px, 4px);
  filter: brightness(1.05);
}

.kpi-card:hover .kpi-card__gold-accent {
  transform: translate(3px, 3px);
  filter: brightness(1.08);
  box-shadow: 1px 1px 24px rgba(236,203,71,0.42);
}

.kpi-card:hover .kpi-card__surface {
  transform: translate(-1px, -1px);
}

/* active */
.kpi-card:active {
  transform: translateY(1px);
}

.kpi-card:active .kpi-card__gold-back {
  transform: translate(2px, 2px);
}

.kpi-card:active .kpi-card__gold-accent {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 14px rgba(236,203,71,0.22);
}

.kpi-card:active .kpi-card__surface {
  transform: translate(0, 0);
}

/* highlighted */
.kpi-card--highlighted .kpi-card__gold-back {
  filter: brightness(1.08);
}

.kpi-card--highlighted .kpi-card__gold-accent {
  box-shadow: 1px 1px 28px rgba(236,203,71,0.45);
  filter: brightness(1.08);
}

.kpi-card--highlighted .kpi-card__value {
  background: linear-gradient(90deg, #E8D483 0%, #A78435 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}  React 
type KpiCardProps = {
  title: string
  value: string | number
  sub: string
  icon?: React.ReactNode
  highlighted?: boolean
}

export function KpiCard({
  title,
  value,
  sub,
  icon,
  highlighted = false,
}: KpiCardProps) {
  return (
    <div className={`kpi-card ${highlighted ? "kpi-card--highlighted" : "kpi-card--default"}`}>
      <div className="kpi-card__base" />
      <div className="kpi-card__gold-back" />
      <div className="kpi-card__gold-accent" />
      <div className="kpi-card__surface" />

      {icon ? <div className="kpi-card__icon">{icon}</div> : null}

      <div className="kpi-card__content">
        <div className="kpi-card__title">{title}</div>
        <div className="kpi-card__value">{value}</div>
        <div className="kpi-card__sub">{sub}</div>
      </div>
    </div>
  )
}
