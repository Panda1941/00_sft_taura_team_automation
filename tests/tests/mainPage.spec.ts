import { test, expect } from '@playwright/test';
import { vars } from '../others/constants';
import { MainPage } from '../classes/mainPage.page';

let mainPage: MainPage;

test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.goto();
});

test('Choose a dish', async ({ page }) => {
    await mainPage.chooseDish();
    await mainPage.clickOrderDishesButton();
    await mainPage.verifyDishChosen();
});

// Not 100% sure of what else to test here, everything seems to be working as expected