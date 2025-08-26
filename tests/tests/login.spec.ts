import { test, expect } from '@playwright/test';
import { vars } from '../others/constants';
import { loginPage as LoginPageClass } from '../classes/loginPage.page';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

let loginPage: LoginPageClass;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPageClass(page);
    await loginPage.goto();
});

// Base case for logins
test.describe('Login with correct credentials', () => {
    test('Regular Login', async ({ page }) => {
        await loginPage.enterCredentials(vars.correct_email, vars.correct_password);
        await loginPage.submitLogin();
        await loginPage.verifyLoginSuccess();
    });
    test('Admin Login', async ({ page }) => {
        await loginPage.enterCredentials(vars.admin_email, vars.admin_password);
        await loginPage.submitLogin();
        await loginPage.verifyLoginSuccess();
        await loginPage.verifyAdmin();
    });
});

// Other cases for incorrect credentials
test.describe('Login with incorrect credentials', () => {
    [
        { "email": vars.incorrect_email, "password": vars.incorrect_password, "desc": "both email and password are incorrect" },
        { "email": vars.incorrect_email, "password": vars.correct_password, "desc": "incorrect email" },
        { "email": vars.correct_email, "password": vars.incorrect_password, "desc": "incorrect password" },
        { "email": "", "password": vars.correct_password, "desc": "empty email" },
        { "email": vars.correct_email, "password": "", "desc": "empty password" }
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
    await loginPage.enterCredentials(vars.correct_email, vars.correct_password);
    await loginPage.submitLogin();

    await loginPage.verifyLoginSuccess();

    await loginPage.signOut();

    await expect(page).toHaveURL('/login-password');
});