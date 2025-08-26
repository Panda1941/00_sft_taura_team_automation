import { Page, expect, Locator, test } from '@playwright/test';
import { BasePage } from './basePage.page';
import { loginPage as LoginPageClass } from './loginPage.page';
import { vars } from '../others/constants';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export class mainPageAdmin extends BasePage {
    loginPage: LoginPageClass;

    lunchEditingButton: Locator;
    newProviderButton: Locator;

    providerNameField: Locator;

    dishNameField: Locator;
    dishPriceField: Locator;
    dishCountField: Locator;

    constructor(page: Page){
        super(page);
        this.loginPage = new LoginPageClass(page);

        this.lunchEditingButton = page.getByText('mode_editLunch Editing');
        this.newProviderButton = page.getByRole('button').filter({ hasText: 'add' });

        this.providerNameField = page.getByRole('combobox', { name: 'Provider Name' });

        this.dishNameField = page.getByRole('textbox', { name: 'Selection Name' });
        this.dishPriceField = page.getByRole('spinbutton', { name: 'Price' });
        this.dishCountField = page.getByRole('spinbutton', { name: 'Count' });
    }

    async goto(){
        await this.loginPage.goto();
        await this.loginPage.loginWithAdminCredentials();
        
        if(await this.closeReviewButton.isVisible()){
            await this.closeReviewDialog();
        }
    }

    async createNewProvider(){
        await this.lunchEditingButton.click();
        await this.page.getByRole('button').filter({ hasText: 'buildclose' }).hover();
        await this.newProviderButton.click();

        await this.providerNameField.fill(vars.provider_name);

        // Select color (done without locators since its a single checkbox)
        await this.page.getByRole('combobox', { name: 'Color' }).click();
        await this.page.locator('a').filter({ hasText: 'Red' }).first().click();

        await this.fillDishData(vars.soup_name, vars.soup_price, vars.soup_count);

        await this.page.getByText('Pagrindiniai Patiekalai').click();
        await delay(500);   // Small delay to account for the transition
        await this.fillDishData(vars.dish_name, vars.dish_price, vars.dish_count);

        await this.page.getByRole('button', { name: 'Save' }).click();

        await expect(this.page.getByText('Provider Succesfully saved.')).toBeVisible();
        await expect(this.page.getByText('checktestSupplier')).toBeVisible();
    }

    async fillDishData(name: string, price: number, count: number) {
        await this.dishNameField.fill(name);
        await this.dishPriceField.fill(price.toString());
        await this.dishCountField.fill(count.toString());
    }

    async checkProvider() {
    }
}