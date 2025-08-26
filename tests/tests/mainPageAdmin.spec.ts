import { test, expect } from '@playwright/test';
import { vars } from '../others/constants';
import { mainPageAdmin as MainPageAdminClass } from '../classes/mainPageAdmin.page';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

let mainPage: MainPageAdminClass;

test.beforeEach(async ({ page }) => {
    mainPage = new MainPageAdminClass(page);
    await mainPage.goto();
});

test('Create new provider', async () => {
    await mainPage.createNewProvider();
});