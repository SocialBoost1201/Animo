#!/bin/bash
# Gallery images re-compression script
IMG_DIR="/Users/takumashinnyo/workspace/projects/Animo/public/images"

TARGETS=(
  "animo-main-chandelier-interior"
  "bar-counter"
  "curtain_room"
  "chandelier2"
  "chandelier"
  "animo-stone-logo-wall"
  "animo-luxury-lounge-seating"
  "animo-champagne-angel-display"
  "animo-curtain-room-seating"
  "animo-main-sofa-seating"
  "animo-main-floor-seating-area"
  "animo-red-rose-flower-display"
  "animo-main-floor-bar-area"
)

echo "=== 画像再圧縮開始 ==="
TOTAL_BEFORE=0
TOTAL_AFTER=0

for j in "${TARGETS[@]}"; do
  SRC_JPG="${IMG_DIR}/${j}.jpg"
  DST_WEBP="${IMG_DIR}/${j}.webp"

  if [ -f "$SRC_JPG" ]; then
    BEFORE=$(stat -f%z "$DST_WEBP" 2>/dev/null || echo 0)
    /usr/local/bin/cwebp -q 75 -resize 1600 0 "$SRC_JPG" -o "$DST_WEBP" -quiet
    AFTER=$(stat -f%z "$DST_WEBP")
    BEFORE_KB=$(( BEFORE / 1024 ))
    AFTER_KB=$(( AFTER / 1024 ))
    TOTAL_BEFORE=$(( TOTAL_BEFORE + BEFORE ))
    TOTAL_AFTER=$(( TOTAL_AFTER + AFTER ))
    echo "✅ ${j}.webp : ${BEFORE_KB}KB → ${AFTER_KB}KB (from jpg)"
  elif [ -f "$DST_WEBP" ]; then
    # WebP only - convert via ffmpeg as intermediate
    TMP_BMP="${IMG_DIR}/_tmp_${j}.bmp"
    ffmpeg -i "$DST_WEBP" "$TMP_BMP" -y -loglevel quiet 2>/dev/null
    BEFORE=$(stat -f%z "$DST_WEBP")
    /usr/local/bin/cwebp -q 75 -resize 1600 0 "$TMP_BMP" -o "$DST_WEBP" -quiet
    AFTER=$(stat -f%z "$DST_WEBP")
    rm -f "$TMP_BMP"
    BEFORE_KB=$(( BEFORE / 1024 ))
    AFTER_KB=$(( AFTER / 1024 ))
    TOTAL_BEFORE=$(( TOTAL_BEFORE + BEFORE ))
    TOTAL_AFTER=$(( TOTAL_AFTER + AFTER ))
    echo "✅ ${j}.webp : ${BEFORE_KB}KB → ${AFTER_KB}KB (via ffmpeg)"
  else
    echo "❌ Not found: $j"
  fi
done

TOTAL_BEFORE_KB=$(( TOTAL_BEFORE / 1024 ))
TOTAL_AFTER_KB=$(( TOTAL_AFTER / 1024 ))
SAVED_KB=$(( TOTAL_BEFORE_KB - TOTAL_AFTER_KB ))
echo ""
echo "=== 合計 ==="
echo "Before: ${TOTAL_BEFORE_KB}KB"
echo "After:  ${TOTAL_AFTER_KB}KB"
echo "Saved:  ${SAVED_KB}KB"
