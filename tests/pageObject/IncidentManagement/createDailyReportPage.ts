import { expect, Locator, Page } from "@playwright/test";

export class CreateDailyReportPage {
    readonly page: Page;
    readonly reportTypeField: Locator;
    readonly lostDocumentReportVal: Locator;
    readonly evidenceReportVal: Locator;
    readonly crimeReportVal: Locator;
    readonly trafficCrimceReportVal: Locator;
    readonly responsiblePersonField: Locator;
    readonly cancelBtn: Locator;
    readonly submitBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.reportTypeField = page.getByLabel('ประเภทรายงาน');
        this.responsiblePersonField = page.getByLabel('ผู้รับผิดชอบ');
        this.cancelBtn = page.getByRole('button', { name: 'ยกเลิก' });
        this.submitBtn = page.getByRole('button', { name: 'บันทึก' });
        this.lostDocumentReportVal = page.getByText('ประจำวันรับแจ้งเอกสารหาย');
        this.evidenceReportVal = page.getByText('ประจำวันรับแจ้งเป็นหลักฐาน');
        this.trafficCrimceReportVal = page.getByText('ประจำวันเกี่ยวกับคดีจราจร');
        this.crimeReportVal = page.getByText('ประจำวันเกี่ยวกับคดีอาญา');
    }
}