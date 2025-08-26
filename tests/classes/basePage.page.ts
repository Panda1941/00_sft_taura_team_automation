import { Page, Locator } from '@playwright/test';

/**
 * Base page for shared selectors and actions
 */
export class BasePage {
    readonly page: Page;
    readonly closeReviewButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.closeReviewButton = page.getByRole('button', { name: 'Close' });
    }

    /** Navigates to the home page. */
    async goto() {
        await this.page.goto('/');
    }

    /** Closes the review dialog if open. */
    async closeReviewDialog() {
        await this.closeReviewButton.click();
    }
}