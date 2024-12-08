import { Locator, Page, expect } from "@playwright/test";
const fs = require("fs");

export class ExportReport {
    readonly page: Page;
    readonly csvExportBtn: Locator;
    readonly excelExportBtn: Locator;
    filename: string;
    readonly closeBtn: Locator;

    constructor(page: Page){
        this.page = page;
        this.csvExportBtn = page.getByTestId('csv');
        this.excelExportBtn = page.getByTestId('excel');
        this.closeBtn = page.locator('[aria-label="close"]');
    }

    async exportByFormat(format: string) {
        const downloadPromise = this.page.waitForEvent('download');
        if(format == 'csv') await this.csvExportBtn.click();
        else if(['xls', 'excel', 'xlsx'].includes(format.toLocaleLowerCase())) await this.excelExportBtn.click();
        const filenames = (await downloadPromise).suggestedFilename();
        const download = await downloadPromise;
        console.log(await download.path());
        await download.saveAs(`./playwright-report/${filenames}`)
        // console.log(filenames)
        this.filename = filenames;
        this.closeModal();
    }

    async validateExcelData(obj: object) {
        let workbook = fs.readFileSync(`./playwright-report/${this.filename}`).toString();
        // console.log(workbook);
        for(let key in obj) {
            // console.log(obj[key]);
            await expect(workbook).toMatch(obj[key]);
        }
    }

    async closeModal() {
        this.closeBtn.click();
    }

}