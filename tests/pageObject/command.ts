import { expect, Locator, Page } from "@playwright/test";
import { notification, api } from "../testResult/testResult";

export function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export function randomNumber(length) {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export function makePhone() {
    const length = 10;
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}


export function thaiIdCardGenerate (){
    const d1: number = Math.floor(Math.random() * 9) + 1;
    const d2 = Math.floor(Math.random() * 10);
    const d3 = Math.floor(Math.random() * 10);
    const d4 = Math.floor(Math.random() * 10);
    const d5 = Math.floor(Math.random() * 10);
    const d6 = Math.floor(Math.random() * 10);
    const d7 = Math.floor(Math.random() * 10);
    const d8 = Math.floor(Math.random() * 10);
    const d9 = Math.floor(Math.random() * 10);
    const d10 = Math.floor(Math.random() * 10);
    const d11 = Math.floor(Math.random() * 10);
    const d12 = Math.floor(Math.random() * 10);
    let d13;
    let n13 = 11 - (((d1 * 13) + (d2 * 12) + (d3 * 11) + (d4 * 10) + (d5 * 9) + (d6 * 8) + (d7 * 7) + (d8 * 6) + (
        d9 * 5) + (d10 * 4) + (d11 * 3) + (d12 * 2)) % 11);
    if (n13 >= 10) {
        d13 = n13 - 10;
    } else {
        d13 = n13;
    }
    const cid = ''+d1+d2+d3+d4+d5+d6+d7+d8+d9+d10+d11+d12+d13;
    return cid;
}

export async function providerSubmitNotification(page: Page,elements: Locator,notificationAlert: Locator,module: string,functions: string,status: string) {
    await elements.click();
    let res = await page.waitForResponse(resp => resp.url().includes(api[`${module}`][`${functions}`]['url']));
    await expect(notificationAlert.locator('.title')).toHaveText(notification[`${module}`][`${functions}`][`${status}`].title);
    let res_body = await res.json();
    return res_body;
}

export async function uploadFile(page: Page,uploadBtn: Locator,fileName: string){
    const fileChoosePromise = page.waitForEvent('filechooser');
    await uploadBtn.click();
    const fileChooser = await fileChoosePromise;
    await fileChooser.setFiles(fileName);
    await page.waitForResponse(resp => resp.url().includes(api.personnel.upload.url) && resp.request().method() === api.personnel.upload.method && resp.status() === 200)
}

export async function clearFieldValue(field: Locator){
    const ln = await (await field.inputValue()).length;
    if(ln != 0){
        await field.clear();
    }
}

