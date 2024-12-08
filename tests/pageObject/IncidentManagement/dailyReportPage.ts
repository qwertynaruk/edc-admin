import { expect, Locator, Page } from "@playwright/test";

export class DailyReport {
    readonly page: Page;
    readonly startDateTimeField: Locator;
    dayOnCalendarPicker: Locator;
    monthBtnOnCalendarPicker: Locator;
    monthOnCalendarPicker: Locator;
    acceptBtnOnCalendarPicker: Locator;
    readonly endDataTimeField: Locator;
    readonly sourceField: Locator;
    sourceDropdownValue: Locator;
    sourceValue: Locator;
    readonly recorderField: Locator;
    recorderValue: Locator;
    readonly inquiryOfficialField: Locator;
    inquiryOfficialValue: Locator;
    readonly recordByYourselfCheckBox: Locator;
    readonly basicInfoSaveBtn: Locator

    constructor(page:Page) {
        this.page = page;
        this.startDateTimeField = page.getByPlaceholder('ช่วงเวลาเริ่มต้น');
        this.endDataTimeField = page.getByPlaceholder('ช่วงเวลาสิ้นสุด');
        this.sourceField = page.getByLabel('ที่มาของข้อมูล');
        this.recorderField = page.getByLabel('ผู้บันทึกรายงาน');
        this.inquiryOfficialField = page.getByLabel('พนักงานสอบสวน', { exact: true });
        this.recordByYourselfCheckBox = page.getByLabel('พนักงานสอบสวนบันทึกเอง');
        this.basicInfoSaveBtn = page.getByTestId('basic-information-button-submit');
    }

    async lostDocumentReport() {
        await this.startDateTimeField.click();
        await this.randomDateTimeOnCalendar();
        await this.sourceField.click();
        this.sourceDropdownValue = this.page.getByTitle('เหตุซึ่งหน้า')
        await this.sourceDropdownValue.click();
        this.sourceValue = this.page.locator('#root').getByTitle('เหตุซึ่งหน้า')
        await expect(this.sourceValue).toBeVisible();
        await this.recorderField.fill('วรภพ');
        await this.page.keyboard.press('Enter');
        this.recorderValue = this.page.locator('#root').getByTitle('ส.ต.ท. วรภพ สืบสวน');
        await expect(this.recorderValue).toBeVisible();
        await this.recordByYourselfCheckBox.click();
        await expect(this.inquiryOfficialField).toBeDisabled();

        await expect(this.basicInfoSaveBtn).not.toBeDisabled();
        await this.basicInfoSaveBtn.click();

        await Promise.all([
            this.page.waitForResponse(resp => resp.url().includes(`/v1/report?report_id=`) && resp.status() === 200),
            this.page.waitForResponse(resp => resp.url().includes(`/v1/report?report_id=`) && resp.status() === 200),
            this.page.waitForResponse(resp => resp.url().includes(`/v1/report_types`) && resp.status() === 200)
        ])
    }

    async randomDateTimeOnCalendar() {
        let month = setNumberToString(getRandomInt(1,12))
        this.monthBtnOnCalendarPicker = this.page.locator('.ant-picker-month-btn');
        await this.monthBtnOnCalendarPicker.click();
        this.monthOnCalendarPicker = this.page.getByTitle(`2023-${month}`)
        await this.monthOnCalendarPicker.click()

        let day = getRandomInt(1,28);
        let startDate = `2023-${month}-${setNumberToString(day)}`;
        this.dayOnCalendarPicker = this.page.getByTitle(startDate);
        await this.dayOnCalendarPicker.click();
        this.acceptBtnOnCalendarPicker = this.page.getByRole('button', { name: 'ตกลง' });
        await this.acceptBtnOnCalendarPicker.click()

        let day2 = getRandomInt(day,28);
        let endDate = `2023-${month}-${setNumberToString(day2)}`;
        this.dayOnCalendarPicker = this.page.getByTitle(endDate);
        await this.dayOnCalendarPicker.click();
        await this.acceptBtnOnCalendarPicker.click()
        
        // await expect(this.startDateTimeField).toHaveValue(new RegExp(`^${startDate}`))
        // await expect(this.endDataTimeField).toHaveValue(endDate)
    }
}

function getRandomInt(min,max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function setNumberToString(number) {
    if(number < 10) {
        return '0'+number;
    }else return number+'';
}