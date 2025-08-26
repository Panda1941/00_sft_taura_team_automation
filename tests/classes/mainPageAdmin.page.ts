import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './basePage.page';
import { LoginPage } from './loginPage.page';
import { vars } from '../others/constants';
import { delay } from './helper';

/**
 * Page object for main admin page actions and selectors
 */
export class MainPageAdmin extends BasePage {
    readonly loginPage: LoginPage;
    readonly lunchEditingButton: Locator;
    readonly newProviderButton: Locator;
    readonly providerNameField: Locator;
    readonly dishNameField: Locator;
    readonly dishPriceField: Locator;
    readonly dishCountField: Locator;

    constructor(page: Page) {
        super(page);
        this.loginPage = new LoginPage(page);
        this.lunchEditingButton = page.getByText('mode_editLunch Editing');
        this.newProviderButton = page.getByRole('button').filter({ hasText: 'add' });
        this.providerNameField = page.getByRole('combobox', { name: 'Provider Name' });
        this.dishNameField = page.getByRole('textbox', { name: 'Selection Name' });
        this.dishPriceField = page.getByRole('spinbutton', { name: 'Price' });
        this.dishCountField = page.getByRole('spinbutton', { name: 'Count' });
    }

    /** Navigates to admin page and logs in as admin. */
    async goto() {
        await this.loginPage.goto();
        await this.loginPage.loginWithAdminCredentials();
        if (await this.closeReviewButton.isVisible()) {
            await this.closeReviewDialog();
        }
    }

    /** Creates a new provider with given parameters. */
    async createNewProvider(params: { name: string, color: string, soup: { name: string, price: number, count: number }, dish: { name: string, price: number, count: number } }) {
        await this.lunchEditingButton.click();
        await this.page.getByRole('button').filter({ hasText: 'buildclose' }).hover();
        await this.newProviderButton.click();
        
        await this.providerNameField.fill(params.name);
        await this.page.getByRole('combobox', { name: 'Color' }).click();
        await this.page.locator('a').filter({ hasText: params.color }).first().click();
        await this.fillDishData(params.soup.name, params.soup.price, params.soup.count);
        await this.page.getByText('Pagrindiniai Patiekalai').click();
        await delay(vars.transition_delay);
        await this.fillDishData(params.dish.name, params.dish.price, params.dish.count);
        await this.page.getByRole('button', { name: 'Save' }).click();
    }

    /** Fills dish data fields. */
    async fillDishData(name: string, price: number, count: number) {
        await this.dishNameField.fill(name);
        await this.dishPriceField.fill(price.toString());
        await this.dishCountField.fill(count.toString());
    }

    /** Verifies provider creation success. */
    async verifyProviderCreated(name: string) {
        await expect(this.page.getByText('Provider Succesfully saved.')).toBeVisible();
        await expect(this.page.getByText('check' + name).first()).toBeVisible();
    }
}