import { expect, Locator, Page, request } from "@playwright/test";
import { api } from "../testResult/testResult";

export class LoginPage {
    readonly page: Page;
    readonly usernameField: Locator;
    readonly passwordField: Locator;
    readonly loginBtn: Locator;
    readonly forgotPasswordBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameField = page.locator('#login-form_username');
        this.passwordField = page.locator('#login-form_password');
        this.loginBtn = page.getByRole('button', {name : 'เข้าสู่ระบบ'});
        this.forgotPasswordBtn = page.getByText('ลืมรหัสผ่าน');
    }

    async goto() {
        await this.page.goto('https://dev.udoncop.com/auth/login');
    }

    async login(username: string, password: string) {
        await this.usernameField.fill(username);
        await this.passwordField.fill(password);
        await this.loginBtn.click();
        const [loginRes] = await Promise.all([
            this.page.waitForResponse(resp => 
                resp.url().includes('/v1/login') && resp.status() === 200
            ),
            this.page.waitForResponse(res => 
                res.url().includes('/v1/personnel?limit=') && res.status() == 200     
            ),
            this.page.waitForResponse(res => 
                res.url().includes('/v1/offense_codes') && res.status() == 200     
            )
        ]) 
        let res_json = await loginRes.json();
        await expect(this.page).toHaveURL(/app\/launchpad/,{timeout: 10000});
        return res_json;
    }

    async loginByApiSuccess(usernames:string,passwords: string) {
        const context = await request.newContext();
        const req = await context.post(api.Login.url,{
            data: {
                username: usernames,
                password: passwords,
                auth_type: "police"
            }
        })
        expect(req.status()).toEqual(200);
        expect(req.ok).toBeTruthy();
    }

    async loginByApiError(usernames:string,passwords: string) {
        const context = await request.newContext();
        const req = await context.post(api.Login.url,{
            data: {
                username: usernames,
                password: passwords,
                auth_type: "police"
            }
        })
        expect(req.status()).not.toEqual(200);
    }
}