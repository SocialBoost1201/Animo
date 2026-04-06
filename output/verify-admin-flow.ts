import { chromium, type Page } from 'playwright';

async function loginAdmin(page: Page, loginId: string, password: string): Promise<boolean> {
  await page.goto('http://127.0.0.1:4100/admin/login', { waitUntil: 'domcontentloaded' });
  if (!page.url().includes('/admin/login')) {
    return true;
  }
  const loginInputCount = await page.locator('input[name=email]').count();
  if (loginInputCount === 0) {
    return false;
  }
  await page.fill('input[name=email]', loginId);
  await page.fill('input[name=password]', password);
  await Promise.all([page.click('button[type=submit]'), page.waitForLoadState('networkidle')]);
  return !page.url().includes('/admin/login');
}

async function createCast(page: Page, payload: {
  real_name: string;
  name_kana: string;
  stage_name: string;
  date_of_birth: string;
  phone: string;
  email: string;
}) {
  await page.goto('http://127.0.0.1:4100/admin/human-resources/new', { waitUntil: 'networkidle' });
  await page.fill('input[name=real_name]', payload.real_name);
  await page.fill('input[name=name_kana]', payload.name_kana);
  await page.fill('input[name=stage_name]', payload.stage_name);
  await page.fill('input[name=date_of_birth]', payload.date_of_birth);
  await page.fill('input[name=phone]', payload.phone);
  await page.fill('input[name=email]', payload.email);
  await Promise.all([page.click('button[type=submit]'), page.waitForLoadState('networkidle')]);
  const currentUrl = page.url();
  const listPageRedirected =
    currentUrl === 'http://127.0.0.1:4100/admin/human-resources' ||
    currentUrl.startsWith('http://127.0.0.1:4100/admin/human-resources?');

  await page.goto(
    `http://127.0.0.1:4100/admin/human-resources?tab=casts&q=${encodeURIComponent(payload.stage_name)}`,
    { waitUntil: 'networkidle' },
  );
  const body = (await page.textContent('body')) || '';
  const listContainsCreatedStageName = body.includes(payload.stage_name);

  return {
    ok: listPageRedirected || listContainsCreatedStageName,
    urlAfterSubmit: currentUrl,
    listContainsCreatedStageName,
  };
}

async function checkValidationErrors(page: Page) {
  await page.goto('http://127.0.0.1:4100/admin/human-resources/new', { waitUntil: 'networkidle' });
  await page.fill('input[name=real_name]', 'x'.repeat(101));
  await page.fill('input[name=name_kana]', 'やまだ');
  await page.fill('input[name=stage_name]', '   ');
  await page.fill('input[name=date_of_birth]', '2999-01-01');
  await page.fill('input[name=phone]', '123');
  await page.fill('input[name=email]', 'invalid');

  await page.locator('input[name=real_name]').blur();
  await page.locator('input[name=name_kana]').blur();
  await page.locator('input[name=stage_name]').blur();
  await page.locator('input[name=date_of_birth]').blur();
  await page.locator('input[name=phone]').blur();
  await page.locator('input[name=email]').blur();

  const fieldErrors = await page.$$eval('.text-red-600', (nodes) =>
    nodes.map((node) => node.textContent?.trim() || '').filter(Boolean),
  );
  return fieldErrors;
}

async function checkEditImageUi(page: Page, castId: string) {
  await page.goto(`http://127.0.0.1:4100/admin/human-resources/${castId}`, { waitUntil: 'networkidle' });
  const profileImageSectionCount = await page.getByText('プロフィール画像', { exact: false }).count();
  const formUploadCount = await page.locator('input[name=image_file]').count();
  return { profileImageSectionCount, formUploadCount };
}

async function updateCast(page: Page, castId: string, payload: {
  real_name: string;
  name_kana: string;
  stage_name: string;
  date_of_birth: string;
  phone: string;
  email: string;
}) {
  await page.goto(`http://127.0.0.1:4100/admin/human-resources/${castId}`, { waitUntil: 'networkidle' });
  const formCount = await page.locator('input[name=real_name]').count();
  if (formCount === 0) {
    const bodyPreview = ((await page.textContent('body')) || '').slice(0, 240);
    return { ok: false, url: page.url(), formCount, bodyPreview };
  }
  await page.fill('input[name=real_name]', payload.real_name);
  await page.fill('input[name=name_kana]', payload.name_kana);
  await page.fill('input[name=stage_name]', payload.stage_name);
  await page.fill('input[name=date_of_birth]', payload.date_of_birth);
  await page.fill('input[name=phone]', payload.phone);
  await page.fill('input[name=email]', payload.email);
  await Promise.all([page.click('button[type=submit]'), page.waitForLoadState('networkidle')]);
  const urlAfterSubmit = page.url();
  const listPageRedirected =
    urlAfterSubmit === 'http://127.0.0.1:4100/admin/human-resources' ||
    urlAfterSubmit.startsWith('http://127.0.0.1:4100/admin/human-resources?');

  await page.goto(`http://127.0.0.1:4100/admin/human-resources/${castId}`, { waitUntil: 'networkidle' });
  const reloadFormCount = await page.locator('input[name=real_name]').count();
  if (reloadFormCount === 0) {
    const reloadedBodyPreview = ((await page.textContent('body')) || '').slice(0, 240);
    return {
      ok: false,
      urlAfterSubmit,
      formCount,
      reloadedValues: null,
      reloadedUrl: page.url(),
      reloadedBodyPreview,
    };
  }
  const reloadedValues = {
    real_name: await page.inputValue('input[name=real_name]'),
    name_kana: await page.inputValue('input[name=name_kana]'),
    stage_name: await page.inputValue('input[name=stage_name]'),
    date_of_birth: await page.inputValue('input[name=date_of_birth]'),
    phone: await page.inputValue('input[name=phone]'),
    email: await page.inputValue('input[name=email]'),
  };
  const valuePersisted =
    reloadedValues.real_name === payload.real_name &&
    reloadedValues.name_kana === payload.name_kana &&
    reloadedValues.stage_name === payload.stage_name &&
    reloadedValues.date_of_birth === payload.date_of_birth &&
    reloadedValues.phone === payload.phone &&
    reloadedValues.email === payload.email;

  return {
    ok: listPageRedirected || valuePersisted,
    urlAfterSubmit,
    formCount,
    valuePersisted,
    reloadedValues,
    reloadedUrl: page.url(),
  };
}

async function main() {
  const loginId = process.env.LoginID;
  const password = process.env.Password;
  const testCastId = process.env.TEST_CAST_ID;
  if (!loginId || !password) throw new Error('LoginID or Password is missing');
  if (!testCastId) throw new Error('TEST_CAST_ID is missing');

  const tag = Date.now().toString();
  const createPayload = {
    real_name: `検証太郎 ${tag}`,
    name_kana: 'ケンショウタロウ',
    stage_name: `検証キャスト${tag}`,
    date_of_birth: '1999-01-23',
    phone: '090-1234-5678',
    email: `cast.verify.${tag}@example.com`,
  };
  const updatePayload = {
    real_name: `更新検証太郎 ${tag}`,
    name_kana: 'コウシンケンショウタロウ',
    stage_name: `更新検証キャスト${tag}`,
    date_of_birth: '1998-12-12',
    phone: '080-9999-0000',
    email: `cast.updated.${tag}@example.com`,
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const loginOk = await loginAdmin(page, loginId, password);
  if (!loginOk) {
    console.log(JSON.stringify({ ok: false, step: 'admin_login', url: page.url() }, null, 2));
    await browser.close();
    return;
  }

  const createResult = await createCast(page, createPayload);
  const reloginOkForValidation = await loginAdmin(page, loginId, password);
  const validationErrors = await checkValidationErrors(page);
  const reloginOkForEdit = await loginAdmin(page, loginId, password);
  const imageUi = await checkEditImageUi(page, testCastId);
  const updateResult = await updateCast(page, testCastId, updatePayload);

  console.log(
    JSON.stringify(
      {
        ok: createResult.ok && updateResult.ok,
        createResult,
        reloginOkForValidation,
        reloginOkForEdit,
        updateResult,
        createPayload,
        updatePayload,
        validationErrors,
        imageUi,
      },
      null,
      2,
    ),
  );

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
