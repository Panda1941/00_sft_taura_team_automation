import { test, expect } from '@playwright/test';
import { vars } from '../others/constants';
import { MainPageAdmin } from '../classes/mainPageAdmin.page';

let mainPage: MainPageAdmin;

test.beforeEach(async ({ page }) => {
    mainPage = new MainPageAdmin(page);
    await mainPage.goto();
});

test('Create new provider', async () => {
    await mainPage.createNewProvider({
        name: vars.provider.name,
        color: vars.provider.color,
        soup: vars.soup,
        dish: vars.dish
    });
    await mainPage.verifyProviderCreated(vars.provider.name);
});

test.describe('Test out invalid admin actions', () => {
    test('Create new provider without a name (negative)', async () => {
        await mainPage.createNewProvider({
            name: '',
            color: vars.provider.color,
            soup: vars.soup,
            dish: vars.dish
        });
        await expect(mainPage.page.getByText('Required.').first()).toBeVisible();
    });

    test('Create new provider without a color (negative)', async () => {
        await mainPage.createNewProvider({
            name: vars.provider.name,
            color: '',
            soup: vars.soup,
            dish: vars.dish
        });
        await expect(mainPage.page.getByText('Required.').first()).toBeVisible();
    });

    test('Create new provider without any dishes (negative)', async () => {
        await mainPage.createNewProvider({
            name: vars.provider.name,
            color: vars.provider.color,
            soup: {
                name: '',
                price: -1,
                count: -1
            },
            dish: {
                name: '',
                price: -1,
                count: -1
            }
        });
        await expect(mainPage.page.getByText('Required.').first()).toBeVisible();
        await expect(mainPage.page.getByText('Value must be greater than zero.').first()).toBeVisible();
    });

});