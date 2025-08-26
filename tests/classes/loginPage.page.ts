import { Page, expect, Locator, test } from '@playwright/test';
import { BasePage } from './basePage.page';
import { vars } from '../others/constants';

export class loginPage extends BasePage {
    readonly email: Locator;
    readonly password: Locator;
    readonly loginButon: Locator;
    readonly appWrap: Locator;

    readonly signOutButton: Locator;
    readonly lunchEditingButton: Locator;
    readonly closeReviewButton: Locator;

    constructor(page: Page){
        super(page);

        this.email = page.locator('input[name=email]');
        this.password = page.locator('input[name=password]');
        this.loginButon = page.locator('button', { hasText: 'Login' });
        this.appWrap = page.locator('.application--wrap');
        this.signOutButton = page.locator('span', { hasText: 'Sign Out' });
        this.signOutButton = page.getByText('exit_to_appSign Out');
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
        await this.loginButon.click();
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
        await expect(this.page.locator('text=Invalid email or password')).toBeVisible();    // <--- This should be improved
    }

    async verifyAdmin(){
        await expect(this.lunchEditingButton).toBeVisible();
    }

    async signOut() {
        await this.signOutButton.click();
    }

    async loginWithBaseCredentials() {
        await this.enterCredentials(vars.correct_email, vars.correct_password);
        await this.submitLogin();

        await this.verifyLoginSuccess();
    }

    async loginWithAdminCredentials(){
        await this.enterCredentials(vars.admin_email, vars.admin_password);
        await this.submitLogin();

        await this.verifyLoginSuccess();
        await this.verifyAdmin();
    }
}