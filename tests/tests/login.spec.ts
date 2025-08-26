import { test, expect } from '@playwright/test';
import { vars } from '../others/constants';
import { LoginPage } from '../classes/loginPage.page';

let loginPage: LoginPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
});

// Base case for logins
test.describe('Login with correct credentials', () => {
    test('Regular Login', async ({ page }) => {
        await loginPage.enterCredentials(vars.credentials.correct.email, vars.credentials.correct.password);
        await loginPage.submitLogin();
        await loginPage.verifyLoginSuccess();
    });
    test('Admin Login', async ({ page }) => {
        await loginPage.enterCredentials(vars.credentials.admin.email, vars.credentials.admin.password);
        await loginPage.submitLogin();
        await loginPage.verifyLoginSuccess();
        await loginPage.verifyAdmin();
    });
});

// Other cases for incorrect credentials
test.describe('Login with incorrect credentials', () => {
    [
        { "email": vars.credentials.incorrect.email, "password": vars.credentials.incorrect.password, "desc": "both email and password are incorrect" },
        { "email": vars.credentials.incorrect.email, "password": vars.credentials.correct.password, "desc": "incorrect email" },
        { "email": vars.credentials.correct.email, "password": vars.credentials.incorrect.password, "desc": "incorrect password" },
        { "email": "", "password": vars.credentials.correct.password, "desc": "empty email" },
        { "email": vars.credentials.correct.email, "password": "", "desc": "empty password" }
    ].forEach(({ email, password, desc }) => {
        test(desc, async ({ page }) => {
            await loginPage.enterCredentials(email, password);
            await loginPage.submitLogin();
            await loginPage.verifyLoginFailure();
        });
    });
});

// Test SignOut
test('SignOut', async ({ page }) => {
    await loginPage.enterCredentials(vars.credentials.correct.email, vars.credentials.correct.password);
    await loginPage.submitLogin();

    await loginPage.verifyLoginSuccess();

    await loginPage.signOut();

    await expect(page).toHaveURL('/login-password');
});