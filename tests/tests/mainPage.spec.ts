import { test, expect } from '@playwright/test';
import { vars } from '../others/constants';
import { mainPage as MainPageClass } from '../classes/mainPage.page';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

let mainPage: MainPageClass;

test.beforeEach(async ({ page }) => {
    mainPage = new MainPageClass(page);
    await mainPage.goto();
});

test('Choose a dish', async ({ page }) => {
    await mainPage.chooseDish();
    await mainPage.clickOrderDishesButton();
    await mainPage.verifyDishChosen();
});

// Not 100% sure of what else to test here, everything seems to be working as expected