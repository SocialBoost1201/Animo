export type CastProfileField =
  | 'real_name'
  | 'name_kana'
  | 'stage_name'
  | 'date_of_birth'
  | 'phone'
  | 'line_id'
  | 'email';

export type CastProfileFieldErrors = Partial<Record<CastProfileField, string>>;

export type CastProfileInput = {
  real_name: string;
  name_kana: string;
  stage_name: string;
  date_of_birth: string;
  phone: string;
  email: string;
};

export type CastProfileNormalized = {
  realName: string;
  nameKana: string;
  stageName: string;
  dateOfBirth: string;
  phone: string;
  email: string | null;
};

function normalizeWhitespace(value: string) {
  return value.trim();
}

export function normalizeRealNameForIdentityMatch(value: string) {
  return value
    .normalize('NFKC')
    .replace(/[\s\u3000]+/g, '')
    .trim();
}

function toHalfWidthDigits(value: string) {
  return value.replace(/[０-９]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0));
}

export function normalizePhone(value: string) {
  const half = toHalfWidthDigits(value);
  return half.replace(/[^\d]/g, '');
}

function isValidDateString(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [yearStr, monthStr, dayStr] = value.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return false;
  if (year < 1900 || year > 2100) return false;
  if (month < 1 || month > 12) return false;

  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() + 1 !== month ||
    parsed.getUTCDate() !== day
  ) {
    return false;
  }

  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  if (parsed.getTime() > todayUtc) return false;

  return true;
}

export function validateCastProfileInput(input: CastProfileInput): {
  values: CastProfileNormalized;
  fieldErrors: CastProfileFieldErrors;
} {
  const values: CastProfileNormalized = {
    realName: normalizeWhitespace(input.real_name),
    nameKana: normalizeWhitespace(input.name_kana),
    stageName: normalizeWhitespace(input.stage_name),
    dateOfBirth: normalizeWhitespace(input.date_of_birth),
    phone: normalizePhone(input.phone),
    email: normalizeWhitespace(input.email).toLowerCase() || null,
  };

  const fieldErrors: CastProfileFieldErrors = {};

  if (!values.realName) {
    fieldErrors.real_name = '名前を入力してください。';
  } else if (values.realName.length > 80) {
    fieldErrors.real_name = '名前は80文字以内で入力してください。';
  }

  if (!values.nameKana) {
    fieldErrors.name_kana = 'フリガナを入力してください。';
  } else if (!/^[ァ-ヶー\s　]+$/.test(values.nameKana)) {
    fieldErrors.name_kana = 'フリガナは全角カタカナで入力してください。';
  } else if (values.nameKana.length > 80) {
    fieldErrors.name_kana = 'フリガナは80文字以内で入力してください。';
  }

  if (!values.stageName) {
    fieldErrors.stage_name = '源氏名を入力してください。';
  } else if (values.stageName.length > 80) {
    fieldErrors.stage_name = '源氏名は80文字以内で入力してください。';
  }

  if (!values.dateOfBirth) {
    fieldErrors.date_of_birth = '生年月日を入力してください。';
  } else if (!isValidDateString(values.dateOfBirth)) {
    fieldErrors.date_of_birth = '生年月日を正しく入力してください。';
  }

  if (!values.phone) {
    fieldErrors.phone = '電話番号を入力してください。';
  } else if (!/^0\d{9,10}$/.test(values.phone)) {
    fieldErrors.phone = '電話番号の形式が正しくありません。';
  }

  if (values.email && values.email.length > 254) {
    fieldErrors.email = 'メールアドレスが長すぎます。';
  } else if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    fieldErrors.email = 'メールアドレスの形式が正しくありません。';
  }

  return { values, fieldErrors };
}
