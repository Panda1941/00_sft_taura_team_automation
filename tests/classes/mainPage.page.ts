import { Page, expect, Locator, test } from '@playwright/test';
import { BasePage } from './basePage.page';
import { loginPage as LoginPageClass } from './loginPage.page';

export class mainPage extends BasePage {
    loginPage: LoginPageClass;

    dishes: Locator;
    orderDishesButton: Locator;

    constructor(page: Page){
        super(page);
        this.loginPage = new LoginPageClass(page);

        this.dishes = page.locator('.dish-card');
        this.orderDishesButton = page.locator('.orders-list-button');
    }

    async goto(){
        await this.loginPage.goto();
        await this.loginPage.loginWithBaseCredentials();
        
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