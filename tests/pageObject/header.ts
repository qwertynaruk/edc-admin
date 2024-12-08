import { expect, Locator, Page } from "@playwright/test";

export class Header {
    readonly page: Page;
    readonly homeBtn: Locator;
    readonly notifications: Locator;
    readonly profile: Locator;
    readonly queueMenu: Locator;
    readonly reportMenu: Locator;
    readonly dailyReportMenu: Locator;
    readonly internalReportMenu: Locator;
    readonly onlineReportMenu: Locator;
    readonly webformReportMenu: Locator;
    readonly onDutyReportMenu: Locator;
    readonly oneNineOneRerpotMenu: Locator;
    readonly incidentSettingMenu: Locator;
    readonly reportManagement: Locator;
    readonly reportTypeManagement: Locator;
    readonly webformManagement: Locator;
    readonly offenceCodeManagement: Locator;
    readonly incidentImportMenu: Locator;
    readonly personnelManagementMenu: Locator;
    readonly dutyScheduleManagementMenu: Locator;
    readonly teamManagementMenu: Locator;
    readonly organizationChartMenu: Locator;
    readonly personnelImportMenu: Locator;
    readonly personnelSettingMenu: Locator;
    readonly positionManagementMenu: Locator;
    readonly departmentManagementMenu: Locator;
    readonly organizationManagementMenu: Locator;

    constructor(page: Page) { 
        this.page = page;
        this.homeBtn = page.locator('img[src="/img/new-logo-dark.png"]')
        this.notifications = page.getByRole('img', { name: 'bell' }).locator('svg');
        this.profile = page.getByRole('list').locator('img');
        this.queueMenu = page.getByRole('link', { name: 'team เรียกคิว' });
        this.reportMenu = page.getByText('รายงาน', { exact: true });
        this.dailyReportMenu = page.getByText('รายงานประจำวัน');
        this.internalReportMenu = page.getByText('รายงานภายในองค์กร');
        this.onlineReportMenu = page.getByText('รายงานแจ้งเหตุออนไลน์');
        this.webformReportMenu = page.getByText('รายงานจากเว็บฟอร์ม');
        this.onDutyReportMenu = page.getByText('รายงานการปฏิบัติหน้าที่');
        this.oneNineOneRerpotMenu = page.getByText('รายงานรับแจ้งเหตุ 191');
        this.incidentSettingMenu = page.getByText('ตั้งค่า');
        this.reportManagement = page.getByText('จัดการรายงาน');
        this.reportTypeManagement = page.getByText('รายงานภายในระบบ');
        this.webformManagement = page.getByText('เว็บฟอร์ม')
        this.incidentImportMenu = page.getByRole('link', { name: 'download นำเข้าข้อมูล' })
        
        this.personnelManagementMenu = page.getByText('กำลังพล');
        this.dutyScheduleManagementMenu = page.getByText('ตารางปฏบัติหน้าที่');
        this.teamManagementMenu = page.getByText('ชุดปฏิบัติการ');
        this.organizationChartMenu = page.getByText('แผนผังภายในองค์กร');
        this.personnelImportMenu = page.getByText('นำเข้าข้อมูล');
        this.personnelSettingMenu = page.getByText('ตั้งค่า');
        this.positionManagementMenu = page.getByText('ตำแหน่ง');
        this.departmentManagementMenu = page.getByText('แผนก/ฝ่ายงาน');
        this.organizationManagementMenu = page.getByText('องค์กร');

    }

    
}