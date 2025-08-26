import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './basePage.page';
import { vars } from '../others/constants';

// Login page actions and selectors
export class LoginPage extends BasePage {
    readonly email: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;
    readonly appWrap: Locator;

    readonly signOutButton: Locator;
    readonly lunchEditingButton: Locator;
    readonly closeReviewButton: Locator;

    constructor(page: Page){
        super(page);

        this.email = page.locator('input[name=email]');
        this.password = page.locator('input[name=password]');
        this.loginButton = page.locator('button', { hasText: 'Login' });
        this.appWrap = page.locator('.application--wrap');
        this.signOutButton = page.locator('span', { hasText: 'Sign Out' });
        this.lunchEditingButton = page.getByText('mode_editLunch Editing');
        this.closeReviewButton = page.getByRole('button', { name: 'Close' });
    }

    async goto(){
        await this.page.goto('/login-password');
    }

    async enterCredentials(email: string, password: string) {
        await this.email.fill(email);
        await this.password.fill(password);
    }

    async submitLogin() {
        await this.loginButton.click();
    }

    async verifyLoginSuccess() {
        // Close any open review dialogs, this is not tested here
        if(await this.closeReviewButton.isVisible()){
            await this.closeReviewDialog();
        }

        await expect(this.signOutButton).toBeVisible();
        await expect(this.page).not.toHaveURL('/login-password');
    }

    async verifyLoginFailure() {
        // Close any open review dialogs, this is not tested here
        if(await this.closeReviewButton.isVisible()){
            await this.closeReviewDialog();
        }

        await expect(this.signOutButton).toBeHidden();
        await expect(this.page).toHaveURL('/login-password');
        // TODO: This currently succeeds even when the actual login would fail. There is no error handling implemented.
        await expect(this.page.locator('text=Invalid email or password')).toBeVisible();    // TODO: This text is not currently shown, need to implement error handling
    }

    async verifyAdmin(){
        await expect(this.lunchEditingButton).toBeVisible();
    }

    async signOut() {
        await this.signOutButton.click();
    }

    async loginWithBaseCredentials() {
        await this.enterCredentials(vars.credentials.correct.email, vars.credentials.correct.password);
        await this.submitLogin();

        await this.verifyLoginSuccess();
    }

    async loginWithAdminCredentials(){
        await this.enterCredentials(vars.credentials.admin.email, vars.credentials.admin.password);
        await this.submitLogin();

        await this.verifyLoginSuccess();
        await this.verifyAdmin();
    }
}