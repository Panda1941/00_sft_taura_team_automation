import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './basePage.page';
import { LoginPage } from './loginPage.page';
import { vars } from '../others/constants';
import { delay } from './helper';

// Main user page actions and selectors
export class MainPage extends BasePage {
    loginPage: LoginPage;

    dishes: Locator;
    orderDishesButton: Locator;

    constructor(page: Page){
        super(page);
        this.loginPage = new LoginPage(page);

        this.dishes = page.locator('.dish-card');
        this.orderDishesButton = page.locator('.orders-list-button');
    }

    async goto(){
        await this.loginPage.goto();
        await this.loginPage.loginWithBaseCredentials();

        await delay(vars.transition_delay);
        if(await this.closeReviewButton.isVisible()){
            await this.closeReviewDialog();
        }
    }

    async chooseDish(){
        await this.dishes.first().click();
    }

    async clickOrderDishesButton(){
        await this.orderDishesButton.click();
    }

    async verifyDishChosen(){
        await expect(this.orderDishesButton).not.toContainText('Skip lunch', { ignoreCase: true });
        let checkMark = this.dishes.first().locator('.v-badge');
        await expect(checkMark).toBeVisible();
    }
}