import { Page, expect, Locator, test } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    readonly closeReviewButton: Locator;

    constructor(page: Page){
        this.page = page;
        
        this.closeReviewButton = page.locator('button', { hasText: 'Close' });
    }

    async goto(){
        await this.page.goto('/');
    }

    async closeReviewDialog(){
        await this.closeReviewButton.click();
    }
}