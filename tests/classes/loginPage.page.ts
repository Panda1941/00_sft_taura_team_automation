
import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './basePage.page';
import { vars } from '../others/constants';

/**
 * Page object for login page actions and selectors
 */
export class LoginPage extends BasePage {
    readonly email: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;
    readonly appWrap: Locator;
    readonly signOutButton: Locator;
    readonly lunchEditingButton: Locator;

    constructor(page: Page) {
        super(page);
        this.email = page.locator('input[name=email]');
        this.password = page.locator('input[name=password]');
        this.loginButton = page.locator('button', { hasText: 'Login' });
        this.appWrap = page.locator('.application--wrap');
        this.signOutButton = page.locator('span', { hasText: 'Sign Out' });
        this.lunchEditingButton = page.getByText('mode_editLunch Editing');
    }

    /** Navigates to login page. */
    async goto() {
        await this.page.goto('/login-password');
    }

    /** Fills in credentials. */
    async enterCredentials(email: string, password: string) {
        await this.email.fill(email);
        await this.password.fill(password);
    }

    /** Clicks login button. */
    async submitLogin() {
        await this.loginButton.click();
    }

    /** Verifies successful login. */
    async verifyLoginSuccess() {
        if (await this.closeReviewButton.isVisible()) {
            await this.closeReviewDialog();
        }
        await expect(this.signOutButton).toBeVisible();
        await expect(this.page).not.toHaveURL('/login-password');
    }

    /** Verifies failed login. */
    async verifyLoginFailure() {
        if (await this.closeReviewButton.isVisible()) {
            await this.closeReviewDialog();
        }
        await expect(this.signOutButton).toBeHidden();
        await expect(this.page).toHaveURL('/login-password');
        await expect(this.page.locator('text=Invalid email or password')).toBeVisible();
    }

    /** Verifies admin login. */
    async verifyAdmin() {
        await expect(this.lunchEditingButton).toBeVisible();
    }

    /** Signs out. */
    async signOut() {
        await this.signOutButton.click();
    }

    /** Logs in with base credentials. */
    async loginWithBaseCredentials() {
        await this.enterCredentials(vars.credentials.correct.email, vars.credentials.correct.password);
        await this.submitLogin();
        await this.verifyLoginSuccess();
    }

    /** Logs in with admin credentials. */
    async loginWithAdminCredentials() {
        await this.enterCredentials(vars.credentials.admin.email, vars.credentials.admin.password);
        await this.submitLogin();
        await this.verifyLoginSuccess();
        await this.verifyAdmin();
    }
}