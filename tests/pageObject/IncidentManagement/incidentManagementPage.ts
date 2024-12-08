import { expect, Locator, Page } from "@playwright/test";
import { Header } from "../header";
import { CreateDailyReportPage } from "./createDailyReportPage";
import { CreateInternalReportPage } from "./createInternalReportPage";
import { CreateOnDutyReportPage } from "./createOnDutyRerportPage";
export { DailyReport } from "./dailyReportPage";

export class IncidentManagementPage{
    readonly page: Page;
    readonly addReportBtn: Locator;

    constructor(page: Page){
        this.page = page;
        this.addReportBtn = page.getByRole('button', { name: 'เพิ่ม' })
    }

    async gotoDailyReport() {
        const header = new Header(this.page);
        await header.reportMenu.click();
        await header.dailyReportMenu.click();
        await this.page.locator('h5.ant-typography').getByText('รายงานประจำวัน').isVisible();
    }

    async gotoInternalReport() {
        const header = new Header(this.page);
        await header.reportMenu.click();
        await header.internalReportMenu.click();
        await this.page.locator('h5.ant-typography').getByText('รายงานภายในองค์กร').isVisible();
    }

    async gotoOnlineReport() {
        const header = new Header(this.page);
        await header.reportMenu.click();
        await header.onlineReportMenu.click();
        await this.page.locator('h5.ant-typography').getByText('รายงานแจ้งเหตุออนไลน์').isVisible();
    }

    async gotoWebformReport() {
        const header = new Header(this.page);
        await header.reportMenu.click();
        await header.webformReportMenu.click();
        await this.page.locator('h5.ant-typography').getByText('รายงานจากเว็บฟอร์ม').isVisible();
    }

    async gotoOnDutyReport() {
        const header = new Header(this.page);
        await header.reportMenu.click();
        await header.onDutyReportMenu.click();
        await this.page.locator('h5.ant-typography').getByText('รายงานการปฏิบัติหน้าที่').isVisible();
    }

    async createDailyReport(testData: object) {
        await this.addReportBtn.click();
        await Promise.all([
            this.page.waitForResponse(resp => resp.url().includes('/v1/permissions?hotfix=permissions-select-widget') && resp.status() === 200)
        ])
        await expect(this.page).toHaveURL(/report\/daily\/create/);
        const createDailyReportPage = new CreateDailyReportPage(this.page);
        await createDailyReportPage.reportTypeField.click();
        await this.page.getByText(testData['report_type']).click();
        await createDailyReportPage.responsiblePersonField.fill(testData['report_responsible']);
        await this.page.keyboard.press('Enter');
        await createDailyReportPage.submitBtn.click();
        let res = await this.page.waitForResponse(resp => resp.url().includes('/v1/report') && resp.status() === 200);
        let res_body = await res.json();
        const report_id = res_body.report_id;
        await Promise.all([
            this.page.waitForResponse(resp => resp.url().includes(`/v1/report?report_id=${report_id}`) && resp.status() === 200),
            this.page.waitForResponse(resp => resp.url().includes(`/v1/report_types`) && resp.status() === 200)
        ])
    }

    async createInternalReport(testData: object) {
        await this.addReportBtn.click();
        await Promise.all([
            this.page.waitForResponse(resp => resp.url().includes('/v1/permissions?hotfix=permissions-select-widget') && resp.status() === 200)
        ])
        await expect(this.page).toHaveURL(/report\/internal\/create/);
        const createInternalReport = new CreateInternalReportPage(this.page);
        await createInternalReport.reportTypeField.click();
        await this.page.getByText(testData['report_type']).first().click();
        await createInternalReport.responsiblePersonField.fill(testData['report_responsible']);
        await this.page.keyboard.press('Enter');
        await createInternalReport.submitBtn.click();
        let res = await this.page.waitForResponse(resp => resp.url().includes('/v1/report') && resp.status() === 200);
        let res_body = await res.json();
        const report_id = res_body.report_id;
        await Promise.all([
            this.page.waitForResponse(resp => resp.url().includes(`/v1/report?report_id=${report_id}`) && resp.status() === 200),
            this.page.waitForResponse(resp => resp.url().includes(`/v1/report_types`) && resp.status() === 200)
        ])
    }

    async createOnDutyReport(testData: Object) {
        await this.addReportBtn.click();
        await Promise.all([
            this.page.waitForResponse(resp => resp.url().includes('/v1/permissions?hotfix=permissions-select-widget') && resp.status() === 200)
        ])
        await expect(this.page).toHaveURL(/report\/onduty\/create/);
        const createOnDutyReport = new CreateOnDutyReportPage(this.page);
        
    }
}