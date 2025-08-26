import { Page, expect, Locator, test } from '@playwright/test';
import { BasePage } from './basePage.page';

export class loginPage extends BasePage {
    readonly email: Locator;
    readonly password: Locator;
    readonly loginButon: Locator;

    constructor(page: Page){
        super(page);

        this.email = page.locator('input[name=email]');
        this.password = page.locator('input[name=password]');
        this.loginButon = page.locator('button', { hasText: 'Login' });
    }

    async goto(){
        await this.page.goto('/login-password');
    }

    async enterCredentials(email: string, password: string) {
        await this.email.fill(email);
        await this.password.fill(password);
    }

    async submitLogin() {
        await this.loginButon.click();
    }
}