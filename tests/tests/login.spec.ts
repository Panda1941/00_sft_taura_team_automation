import { test, expect } from '@playwright/test';
import { vars } from '../others/constants';
import { loginPage as LoginPageClass } from '../classes/loginPage.page';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

let loginPage: LoginPageClass;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPageClass(page);
    await loginPage.goto();
});

// Base case to ensure the login page loads correctly and the user is able to login with correct credentials
test('Login with correct credentials', async ({ page }) => {
    await delay(2000); // <-- here we wait 2s
    await loginPage.enterCredentials(vars.correct_email, vars.correct_password);
    await delay(2000); // <-- here we wait 2s
    await loginPage.submitLogin();
    await delay(2000); // <-- here we wait 2s
});