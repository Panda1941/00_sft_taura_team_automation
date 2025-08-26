
import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './basePage.page';
import { LoginPage } from './loginPage.page';
import { vars } from '../others/constants';
import { delay } from './helper';

/**
 * Page object for main user page actions and selectors
 */
export class MainPage extends BasePage {
    readonly loginPage: LoginPage;
    readonly dishes: Locator;
    readonly orderDishesButton: Locator;

    constructor(page: Page) {
        super(page);
        this.loginPage = new LoginPage(page);
        this.dishes = page.locator('.dish-card');
        this.orderDishesButton = page.locator('.orders-list-button');
    }

    /** Navigates to main page and logs in. */
    async goto() {
        await this.loginPage.goto();
        await this.loginPage.loginWithBaseCredentials();
        await delay(vars.transition_delay);
        if (await this.closeReviewButton.isVisible()) {
            await this.closeReviewDialog();
        }
    }

    /** Chooses the first dish. */
    async chooseDish() {
        await this.dishes.first().click();
    }

    /** Clicks order dishes button. */
    async clickOrderDishesButton() {
        await this.orderDishesButton.click();
    }

    /**TODO: This currently only selects the 1st dish, no matter if it has been chosen by the user already.
    Make sure to clear users previous selection before testing */
    
    /** Verifies dish selection. */
    async verifyDishChosen() {
        await expect(this.orderDishesButton).not.toContainText('Skip lunch', { ignoreCase: true });
        const checkMark = this.dishes.first().locator('.v-badge');
        await expect(checkMark).toBeVisible();
    }
}