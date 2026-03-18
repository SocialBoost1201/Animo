import XlsxPopulate from 'xlsx-populate';
import path from 'path';

async function generateTestExcel() {
  const data = {
    year: 2026,
    month: 4,
    casts: [
      {
        name: 'あんな',
        shifts: { '1': '21:00', '2': '休', '3': '出勤', '10': '22:30', '15': '同伴', '20': '出勤', '30': '休' }
      },
      {
        name: 'みさき',
        shifts: { '1': '休', '2': '21:30', '5': '21:00', '14': '休', '31': '出勤' }
      },
      {
        name: 'テストキャスト',
        shifts: { '10': '21:00', '11': '21:00', '12': '同伴' }
      }
    ]
  };

  const templatePath = path.join(process.cwd(), 'data', 'templates', 'animo_shift_template.xlsx');
  
  // テンプレートを読み込む
  const workbook = await XlsxPopulate.fromFileAsync(templatePath);
  
  const sheet1 = workbook.sheet(0);
  const sheet2 = workbook.sheet(1); // 存在しない場合 undefined になる

  // --- 年月とタイトルの設定 ---
  sheet1.cell('T1').value(data.year);
  sheet1.cell('T2').value(data.month);
  // Title (CONCAT関数が #NAME? になるのを防ぐため、値を直接上書き)
  sheet1.cell('C1').value(`Animo シフト表 ${data.year}年 ${data.month}月 前半`);
  sheet1.cell('C1').style('horizontalAlignment', 'center'); // ★中央揃えの追加
  
  if (sheet2) {
    sheet2.cell('T1').value(data.year);
    sheet2.cell('T2').value(data.month);
    sheet2.cell('C1').value(`Animo シフト表 ${data.year}年 ${data.month}月 後半`);
    sheet2.cell('C1').style('horizontalAlignment', 'center');
  }

  // --- キャストデータ(前半)の書き出し ---
  // xlsx-populate は 1-based index (Row 3, Col 2 etc)
  const startRowFirstHalf = 3;
  data.casts.forEach((cast, index) => {
    const rowNum = startRowFirstHalf + index;
    
    // B列 (Col 2) に名前
    sheet1.cell(rowNum, 2).value(cast.name);
    
    // C列 (Col 3) から Q列 (Col 17) までが1日〜15日
    for(let i = 1; i <= 15; i++) {
        const val = cast.shifts[String(i)];
        if(val) sheet1.cell(rowNum, 2 + i).value(val);
    }
  });

  // --- 後半の書き出し ---
  if (sheet2) {
    const startRowSecondHalf = 3;
    data.casts.forEach((cast, index) => {
      const rowNum = startRowSecondHalf + index;
      
      // B列 (Col 2) に名前
      sheet2.cell(rowNum, 2).value(cast.name);
      
      // C列 (Col 3) から R列 (Col 18) までが16日〜31日
      for(let i = 16; i <= 31; i++) {
        const val = cast.shifts[String(i)];
        if(val) sheet2.cell(rowNum, 2 + (i - 15)).value(val);
      }
    });
  }

  const outputPath = path.join(process.cwd(), 'test_output_populate.xlsx');
  await workbook.toFileAsync(outputPath);
  
  console.log('✅ xlsx-populateでExcelファイルの生成を完了しました ->', outputPath);
}

generateTestExcel().catch(console.error);
