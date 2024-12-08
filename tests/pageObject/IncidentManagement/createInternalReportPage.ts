import { expect, Locator, Page } from "@playwright/test";

export class CreateInternalReportPage {
    readonly page: Page;
    readonly reportTypeField: Locator;
    readonly responsiblePersonField: Locator;
    readonly cancelBtn: Locator;
    readonly submitBtn: Locator;

    constructor(page: Page) {
        this.page = page
        this.reportTypeField = page.getByLabel('ประเภทรายงาน');
        this.responsiblePersonField = page.getByLabel('ผู้รับผิดชอบ');
        this.cancelBtn = page.getByRole('button', { name: 'ยกเลิก' });
        this.submitBtn = page.getByRole('button', { name: 'บันทึก' });
    }
}