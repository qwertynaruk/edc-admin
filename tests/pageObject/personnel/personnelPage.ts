import { expect, Locator, Page , Request} from "@playwright/test";
import { Header, makeid, makePhone, thaiIdCardGenerate, ExportReport} from "../index";
import { PersonnelManagementPage } from "./personnelManagementPage";
import { api } from "../../testResult/testResult";

export class PersonnelPage {
    readonly page: Page;
    readonly personnelTitle: Locator;
    readonly addPersonnelBtn: Locator;
    readonly searchField: Locator;
    readonly exportPersonnelBtn: Locator;

    constructor(page: Page) {  
        this.page = page;
        this.personnelTitle = page.getByRole('heading', { name: 'กำลังพล' });
        this.addPersonnelBtn = page.getByRole('button', { name: 'เพิ่ม' });
        this.searchField = page.getByPlaceholder('ค้นหา');
        this.exportPersonnelBtn = page.getByRole('button', { name: 'ออกรายงาน' });
    }

    async createPersonnelByApi(request,body: object,token: string){
        const res_api = await request.post(api.personnel.create.url,{
            headers: {
              authorization: token,
            },
            data: body,
        });
        expect(res_api.ok()).toBeTruthy();
        const res_json = await res_api.json();
        return res_json
    }

    async prepareTestData(data: object){
        const mid = makeid(4);
        data['last_name'] = 'ออโต้แมต'+mid;
        data['code_name'] = mid;
        const id_card = thaiIdCardGenerate();
        data['id_card_number'] = id_card;
        data['email'] = 'automateTest'+ mid +'@udoncop.com';
        const phone = makePhone();
        data['phone_number'] = phone;
        return data;
    }

    async prepareTestDataforAPI(data: object){
        const mid = makeid(4);
        data['last_name'] = 'ออโต้แมต'+mid;
        data['middle_name'] = mid;
        const id_card = thaiIdCardGenerate();
        data['person_card_id'] = id_card;
        data['email'] = 'automateTest'+ mid +'@udoncop.com';
        const phone = makePhone();
        data['phone_number'] = phone;
        return data;
    }

    async gotoPersonnelMenu() {
        const header = new Header(this.page);
        await header.personnelImportMenu.click();
        await expect(this.page).toHaveURL(/app\/personnel\/list/);
        await expect(this.personnelTitle).toBeVisible();
    }

    async clickAddPersonnelBtn() {
        await this.addPersonnelBtn.click();
        await expect(this.page).toHaveURL(/personnel\/create/);
        const personnelManagementPage = new PersonnelManagementPage(this.page);
        await expect(personnelManagementPage.addPersonnelTitle).toBeVisible();
    }

    async createPersonnelSuccessCase(data: object) {
        await this.clickAddPersonnelBtn();
        const personnelManagementPage = new PersonnelManagementPage(this.page);
        await personnelManagementPage.inputPersonnelData(data);
        data = await personnelManagementPage.submitCreateSuccess();
        await expect(this.page).toHaveURL(/app\/personnel\/list/);
        return data;
    }

    async createPersonnelErrorCase(data: object) {
        await this.clickAddPersonnelBtn();
        const personnelManagementPage = new PersonnelManagementPage(this.page);
        await personnelManagementPage.inputPersonnelDataOnlyRequiredField(data);
        await personnelManagementPage.submitCreateError();
    }

    async selectPersonnelRowByID(id: string) {
        await this.page.locator(`[data-row-key="${id}"]`).click();
        await expect(this.page).toHaveURL(new RegExp(`.*${id}/edit`));
    }

    async validatePersonnelDetail(data: object) {
        const personnelManagementPage = new PersonnelManagementPage(this.page);
        await this.selectPersonnelRowByID(data['_id']);
        await personnelManagementPage.validatePersonnelData(data);
    }

    async searchPersonnelById(data: string){
        await this.searchField.fill(data);
        await this.page.waitForTimeout(500);
        await expect(this.page.locator(`[data-row-key="${data}"]`)).toBeVisible();
    }

    async editPersonnelSuccessCase(data: object) {
        await this.page.waitForTimeout(500);
        await this.searchPersonnelById(data['_id']);
        await this.page.waitForTimeout(500);
        await this.selectPersonnelRowByID(data['_id']);
        const personnelManagementPage = new PersonnelManagementPage(this.page);
        await personnelManagementPage.inputPersonnelData(data);
        await personnelManagementPage.submitEditSuccess();
    }

    async editPersonnelErrorCase(data: object) {
        await this.page.waitForTimeout(500);
        await this.searchPersonnelById(data['_id']);
        await this.page.waitForTimeout(500);
        await this.selectPersonnelRowByID(data['_id']);
        const personnelManagementPage = new PersonnelManagementPage(this.page);
        await personnelManagementPage.inputPersonnelDataOnlyRequiredField(data);
        await personnelManagementPage.submitEditError();
    }

    async personnelListExport(format: string,data: object) {
        await this.exportPersonnelBtn.click();
        const exports = new ExportReport(this.page);
        await exports.exportByFormat(format);
        await exports.validateExcelData(data);
    }

    async changePersonnelStatus(status: boolean,data:object){
        const personnelManagementPage = new PersonnelManagementPage(this.page);
        await this.page.waitForTimeout(500);
        await this.searchPersonnelById(data['_id']);
        await this.page.waitForTimeout(500);
        await this.selectPersonnelRowByID(data['_id']);
        await this.page.waitForResponse(res => 
            res.url().includes(`/v1/personnel/detail?_id=${data['_id']}`)&&
            res.status() === 200
        );
        await personnelManagementPage.setPersonnelStatus(status);
        await personnelManagementPage.submitEditSuccess();
    }
}