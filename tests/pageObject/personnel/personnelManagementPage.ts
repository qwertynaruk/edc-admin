import { expect, Locator, Page } from "@playwright/test";
import { clearFieldValue, providerSubmitNotification, uploadFile } from "../index";

export class PersonnelManagementPage {
    readonly page: Page;
    readonly addPersonnelTitle: Locator;
    readonly activeStatus: Locator;
    readonly addPictureBtn: Locator;
    readonly prefixField: Locator;
    readonly firstNameField: Locator;
    readonly lastNameField: Locator;
    readonly codeNameField: Locator;
    readonly organizationField: Locator;
    readonly organizationAbbField: Locator;
    readonly departmentField: Locator;
    readonly departmentAbbField: Locator;
    readonly positionField: Locator;
    readonly positionAbbField: Locator;
    readonly commanderField: Locator;
    readonly idCardNumberField: Locator;
    readonly emailField: Locator;
    readonly phoneNumberField: Locator;
    readonly passwordField: Locator;
    readonly confirmPasswordField: Locator;
    readonly internalInfoTab: Locator;
    readonly personalInfoTab: Locator;
    readonly documentTab: Locator;
    readonly dominateField: Locator;
    readonly dominateAbbField: Locator;
    readonly stationField: Locator;
    readonly firstPositionDateField: Locator;
    readonly policePositionDateField: Locator;
    readonly governmentDateField: Locator;
    readonly withdrawMoneyField: Locator;
    readonly positionAllowanceField: Locator;
    readonly extraBattleMoneyField: Locator;
    readonly offendersAdditionalMoneyField: Locator;
    readonly remarkField: Locator;
    readonly birthDateField: Locator;
    readonly ageField: Locator;
    readonly genderField: Locator;
    readonly domicileField: Locator;
    readonly qualificationField: Locator;
    readonly uploadDocumentBtn: Locator;
    readonly cancelBtn: Locator;
    readonly submitBtn: Locator;
    readonly passwordEyeInvisible: Locator;
    readonly confirmPasswordEyeInvisible: Locator;
    readonly monthPicker: Locator;
    readonly yearPicker: Locator;
    day: string;
    month: string;
    year: string;
    // personnelId: string;
    dataObj : object;
    responseObj : object;
    readonly successNotification: Locator;
    readonly errorNotification: Locator;

    constructor(page: Page){
        this.page = page;
        this.addPersonnelTitle = page.locator('form').getByText('เพิ่มข้อมูลกำลังพล');
        this.activeStatus = page.locator('#is_active');
        this.addPictureBtn = page.locator('.ant-upload[role="button"]').first();
        this.prefixField = page.getByLabel('คำนำหน้า');
        this.firstNameField = page.locator('#first_name');
        this.lastNameField = page.locator('#last_name');
        this.codeNameField = page.locator('#middle_name');
        this.organizationField = page.getByLabel('องค์กร', { exact: true });
        this.organizationAbbField = page.getByLabel('ตัวย่อองค์กร');
        this.departmentField = page.getByLabel('สังกัดภายใต้แผนก/ฝ่ายงาน');
        this.departmentAbbField = page.getByLabel('ตัวย่อแผนก/ฝ่ายงาน');
        this.positionField = page.getByLabel('ตำแหน่ง', { exact: true });
        this.positionAbbField = page.getByLabel('ตัวย่อตำแหน่ง');
        this.commanderField = page.getByLabel('ผู้บังคับบัญชา');
        this.idCardNumberField = page.locator('#person_card_id');
        this.emailField = page.locator('#email');
        this.phoneNumberField = page.locator('#phone_number');
        this.passwordField = page.getByLabel('ตั้งรหัสผ่าน');
        this.confirmPasswordField = page.getByLabel('กรอกรหัสผ่านอีกครั้ง');
        this.internalInfoTab = page.getByRole('tab', { name: 'ข้อมูลภายในองค์กร' });
        this.personalInfoTab = page.getByRole('tab', { name: 'ข้อมูลส่วนตัว' })
        this.documentTab = page.getByRole('tab', { name: 'เอกสารที่เกี่ยวข้อง' });
        this.dominateField = page.getByLabel('ครองยศ');
        this.dominateAbbField = page.getByLabel('ตัวย่อยศ');
        this.stationField = page.locator('#station');
        this.firstPositionDateField = page.getByLabel('ดำรงตำแหน่งครั้งแรก');
        this.policePositionDateField = page.getByLabel('เป็นนายตำรวจ');
        this.governmentDateField = page.getByLabel('รับราชการ');
        this.withdrawMoneyField = page.getByPlaceholder('กรอกเบิกลด');
        this.positionAllowanceField = page.getByPlaceholder('กรอกเงินประจำตำแหน่ง');
        this.offendersAdditionalMoneyField = page.getByPlaceholder('กรอกเงินเพิ่มพิเศษสำหรับปราบปรามผู้กระทำความผิด');
        this.extraBattleMoneyField = page.getByPlaceholder('กรอกเงินเพิ่มพิเศษสำหรับการสู้รบ');
        this.remarkField = page.getByPlaceholder('กรอกหมายเหตุ');
        this.birthDateField = page.getByPlaceholder('เลือกวันเกิด');
        this.ageField = page.getByPlaceholder('กรุณาเลือกวันที่เพื่อคำนวณอายุ');
        this.genderField = page.locator('#gender');
        this.domicileField = page.locator('#domicile');
        this.qualificationField = page.getByPlaceholder('กรอกคุณวุฒิ');
        this.uploadDocumentBtn = page.getByRole('tabpanel', { name: 'เอกสารที่เกี่ยวข้อง' }).locator('button');
        this.passwordEyeInvisible = page.locator('[data-icon="eye-invisible"]').first();
        this.confirmPasswordEyeInvisible = page.locator('[data-icon="eye-invisible"]').last();
        this.yearPicker = page.locator('.ant-picker-dropdown:visible').locator('.ant-picker-header-view > button.ant-picker-year-btn');
        this.monthPicker = page.locator('.ant-picker-dropdown:visible').locator('.ant-picker-header-view > button.ant-picker-month-btn');
        this.cancelBtn = page.getByRole('button', { name: 'ยกเลิก' });
        this.submitBtn = page.getByRole('button', { name: 'บันทึก' });
        this.successNotification = page.locator('.notification-success');
        this.errorNotification = page.locator('.notification-error');
    }

    async inputPersonnelData(data: object) {
        this.dataObj = data;
        await uploadFile(this.page,this.addPictureBtn,'./tests/testData/profile1.jpg');
        await this.selectPrefix(data['prefix_name']);
        await this.inputFirstName(data['first_name']);
        await this.inputLastName(data['last_name']);
        await this.inputCodeName(data['code_name']);
        await this.selectOrganization(data['organization']);
        await this.selectDepartment(data['department']);
        await this.selectPosition(data['position']);
        await this.selectCommander(data['commander']);
        await this.inputIDCardNumber(data['id_card_number']);
        await this.inputEmail(data['email']);
        await this.inputPhoneNumber(data['phone_number']);
        if(data['password'] != undefined) {
            await this.inputPassword(data['password']);
            await this.inputConfirmPassword(data['password']);
        }
        await this.internalInfoTab.click();
        await this.selectDominate(data['dominate']);
        await this.selectStation(data['station']);
        await this.selectFirstPositionDate(data['first_position_date_time']);
        await this.page.waitForTimeout(500);
        await this.selectPolicePositionDate(data['police_position_date_time']);
        await this.page.waitForTimeout(500);
        await this.selectGovernmentDate(data['government_date_time']);
        await this.inputWithdrawMoney(data['withdraw_money']);
        await this.inputPositionAllowance(data['position_allowance']);
        await this.inputExtraBattleMoney(data['extra_battle_money']);
        await this.inputOffendersAdditionalMoney(data['offenders_additional_money']);
        await this.inputRemark(data['note']);
        await this.personalInfoTab.click();
        await this.page.waitForTimeout(500);
        await this.selectBirthDate(data['date_of_birth']);
        await this.selectGender(data['gender']);
        await this.selectDomicile(data['domicile']);
        await this.inputQualification(data['qualification']);
        await this.documentTab.click();
        await uploadFile(this.page,this.uploadDocumentBtn,'./tests/testData/profile1.jpg');
    }

    async inputPersonnelDataOnlyRequiredField(data: object){
        this.dataObj = data;
        await this.selectPrefix(data['prefix_name']);
        await this.inputFirstName(data['first_name']);
        await this.inputLastName(data['last_name']);
        await this.selectOrganization(data['organization']);
        await this.selectDepartment(data['department']);
        await this.selectPosition(data['position']);
        await this.inputIDCardNumber(data['id_card_number']);
        if(data['email'] != undefined){
            await this.inputEmail(data['email']);
        }
        await this.inputPhoneNumber(data['phone_number']);
        if(data['password'] != undefined) {
            await this.inputPassword(data['password']);
            await this.inputConfirmPassword(data['password']);
        }
        await this.internalInfoTab.click();
        await this.page.waitForTimeout(500);
        await this.selectDominate(data['dominate']);
        await this.selectStation(data['station']);
        await this.personalInfoTab.click();
        await this.page.waitForTimeout(500);
        await this.selectBirthDate(data['date_of_birth']);
        await this.selectGender(data['gender']);
    }

    async submitCreateSuccess() {
        this.responseObj = await providerSubmitNotification(this.page,this.submitBtn,this.successNotification,'personnel','create','success');
        // console.log(this.responseObj);
        this.dataObj['_id'] = this.responseObj['data']['personnel_id'];
        // console.log(this.dataObj);
        return this.dataObj;
    }

    async submitCreateError() {
        await providerSubmitNotification(this.page,this.submitBtn,this.errorNotification,'personnel','create','error');
    }

    async submitEditSuccess() {
        await providerSubmitNotification(this.page,this.submitBtn,this.successNotification,'personnel','edit','success');
    }

    async submitEditError() {
        await providerSubmitNotification(this.page,this.submitBtn,this.errorNotification,'personnel','edit','error');
    }

    async selectPrefix(prefix: string) {
        await this.prefixField.fill(prefix);
        await this.page.getByTitle(prefix,{exact: true}).click();
        await this.expectPrefix(prefix);
    }

    async expectPrefix(prefix: string) {
        await expect(this.page.locator('.ant-select-selector',{has: this.page.locator('#prefix_name')}).getByTitle(prefix)).toBeVisible();
    }

    async inputFirstName(name: string) {
        await clearFieldValue(this.firstNameField);
        await this.firstNameField.fill(name);
        await this.expectFirstName(name);
    }

    async expectFirstName(name: string) {
        await expect(this.firstNameField).toHaveValue(name);
    }

    async inputLastName(lastName: string) {
        await clearFieldValue(this.lastNameField);
        await this.lastNameField.fill(lastName);
        await this.expectLastName(lastName);
    }

    async expectLastName(lastName: string) {
        await expect(this.lastNameField).toHaveValue(lastName);
    }

    async inputCodeName(codeName: string) {
        await clearFieldValue(this.codeNameField);
        await this.codeNameField.fill(codeName);
        await this.expectCodeName(codeName)
    }

    async expectCodeName(codeName: string) {
        await expect(this.codeNameField).toHaveValue(codeName);
    }

    async selectOrganization(orgName: string){
        await this.organizationField.fill(orgName);
        await this.page.getByTitle(orgName,{exact: true}).click();
        await this.expectOrganization(orgName);
    }

    async expectOrganization(orgName: string) {
        await expect(this.page.locator('#root').getByTitle(orgName)).toBeVisible();
        await expect(this.organizationAbbField).not.toBeEmpty();
    }

    async selectDepartment(depName: string) {
        await this.departmentField.fill(depName);
        await this.page.getByTitle(depName,{exact: true}).click();
        await this.expectDepartment(depName);
    }

    async expectDepartment(depName: string) {
        await expect(this.page.locator('#root').getByTitle(depName)).toBeVisible();
        await expect(this.departmentAbbField).not.toBeEmpty();
    }

    async selectPosition(posName: string) {
        await this.positionField.fill(posName);
        await this.page.getByTitle(posName,{exact: true}).click();
        await this.expectPosition(posName);
    }

    async expectPosition(posName: string) {
        await expect(this.page.locator('#root').getByTitle(posName)).toBeVisible();
        await expect(this.positionAbbField).not.toBeEmpty();
    }

    async selectCommander(name: string) {
        await this.commanderField.fill(name);
        await this.page.getByTitle(name).click();
        await this.expectCommander(name);
    }

    async expectCommander(name: string){
        await expect(this.page.locator('#root').getByTitle(name)).toBeVisible();
    }

    async inputIDCardNumber(id: string) {
        await clearFieldValue(this.idCardNumberField);
        await this.idCardNumberField.fill(id);
        await this.expectIDCardNumber(id);
    }

    async expectIDCardNumber(id: string){
        await expect(this.idCardNumberField).toHaveValue(id);
    }

    async inputEmail(email: string) {
        await clearFieldValue(this.emailField);
        await this.emailField.fill(email);
        await this.expectEmail(email);
    }

    async expectEmail(email: string) {
        await expect(this.emailField).toHaveValue(email);
    }

    async inputPhoneNumber(phone: string) {
        await clearFieldValue(this.phoneNumberField);
        await this.phoneNumberField.fill(phone);
        await this.expectPhoneNumber(phone);
    }

    async expectPhoneNumber(phone: string) {
        await expect(this.phoneNumberField).toHaveValue(phone);
    }

    async inputPassword(password: string) {
        await this.passwordEyeInvisible.click();
        await this.passwordField.clear();
        await this.passwordField.fill(password);
        await this.expectPassword(password);
    }

    async expectPassword(password: string) {
        await expect(this.passwordField).toHaveValue(password);
    }

    async inputConfirmPassword(password: string) {
        await this.confirmPasswordEyeInvisible.click();
        await this.confirmPasswordField.clear();
        await this.confirmPasswordField.fill(password);
        await this.expectConfirmPassword(password);
    }

    async expectConfirmPassword(password: string) {
        await expect(this.confirmPasswordField).toHaveValue(password);
    }

    async selectDominate(dominate: string) {
        await this.dominateField.fill(dominate);
        await this.page.locator('div',{has: this.page.locator('#dominate_list')}).getByTitle(dominate,{exact: true}).click();
        await this.expectDominate(dominate);
    }

    async expectDominate(dominate: string) {
        await expect(this.page.locator('.ant-select-selector',{has: this.page.locator('#dominate')}).getByTitle(dominate)).toBeVisible();
        await expect(this.dominateAbbField).not.toBeEmpty();
    }

    async selectStation(station: string) {
        await this.stationField.click({force: true});
        await this.page.getByTitle(station,{exact: true}).click();
        await this.expectStation(station);
    }

    async expectStation(station: string) {
        await expect(this.page.locator('#root').getByTitle(station)).toBeVisible();
    }

    async setDateFormat(date: string) {
        const fullDate = date.split('T');
        const today = fullDate[0].split('-');
        this.day = today[2];
        this.month = today[1];
        this.year = today[0];
    }

    async selectFirstPositionDate(date: string) {
        await this.firstPositionDateField.click();
        await this.selectDatePicker(date);
        await this.expectFirstPositionDate(date);
    }

    async expectFirstPositionDate(date: string){
        await this.setDateFormat(date);
        let y = parseInt(this.year) + 543;
        await expect(this.firstPositionDateField).toHaveValue(y+'-'+this.month+'-'+this.day);
    }

    async selectDatePicker(date: string) {
        await this.setDateFormat(date);
        await this.yearPicker.click();
        await this.page.waitForTimeout(500);
        await this.page.locator('.ant-picker-dropdown:visible').getByTitle(this.year).click();
        await this.monthPicker.click();
        await this.page.locator('.ant-picker-dropdown:visible').getByTitle(this.year+'-'+this.month).click();
        await this.page.locator('.ant-picker-dropdown:visible').getByTitle(this.year+'-'+this.month+'-'+this.day).click();
    }

    async selectPolicePositionDate(date: string){
        await this.policePositionDateField.click();
        await this.selectDatePicker(date);
        await this.expectPolicePositionDate(date);
    }

    async expectPolicePositionDate(date: string){
        await this.setDateFormat(date);
        let y = parseInt(this.year) + 543;
        await expect(this.policePositionDateField).toHaveValue(y+'-'+this.month+'-'+this.day);
    }

    async selectGovernmentDate(date: string){
        await this.governmentDateField.click();
        await this.selectDatePicker(date);
        await this.expectGovernmentDate(date);
    }

    async expectGovernmentDate(date: string){
        await this.setDateFormat(date);
        let y = parseInt(this.year) + 543;
        await expect(this.governmentDateField).toHaveValue(y+'-'+this.month+'-'+this.day);
    }

    async inputWithdrawMoney(amount: string){
        await clearFieldValue(this.withdrawMoneyField);
        await this.withdrawMoneyField.fill(amount);
        await this.expectWithdrawMoney(amount);
    }

    async expectWithdrawMoney(amount: string){
        await expect(this.withdrawMoneyField).toHaveValue(amount);
    }

    async inputPositionAllowance(amount: string){
        await clearFieldValue(this.positionAllowanceField);
        await this.positionAllowanceField.fill(amount);
        await this.expectPositionAllowance(amount);
    }

    async expectPositionAllowance(amount: string){
        await expect(this.positionAllowanceField).toHaveValue(amount);
    }

    async inputExtraBattleMoney(amount: string){
        await clearFieldValue(this.extraBattleMoneyField);
        await this.extraBattleMoneyField.fill(amount);
        await this.expectExtraBattleMoney(amount);
    }

    async expectExtraBattleMoney(amount: string){
        await expect(this.extraBattleMoneyField).toHaveValue(amount);
    }

    async inputOffendersAdditionalMoney(amount: string){
        await clearFieldValue(this.offendersAdditionalMoneyField);
        await this.offendersAdditionalMoneyField.fill(amount);
        await this.expectOffendersAdditionalMoney(amount);
    }

    async expectOffendersAdditionalMoney(amount: string){
        await expect(this.offendersAdditionalMoneyField).toHaveValue(amount);
    }

    async inputRemark(text: string){
        await clearFieldValue(this.remarkField);
        await this.remarkField.fill(text);
        await this.expectRemark(text);
    }

    async expectRemark(text: string){
        await expect(this.remarkField).toHaveValue(text);
    }

    async selectBirthDate(date: string){
        await this.birthDateField.click();
        await this.selectDatePicker(date);
        await this.expectBirthDate(date);
    }

    async expectBirthDate(date: string){
        await this.setDateFormat(date);
        let y = parseInt(this.year) + 543;
        await expect(this.birthDateField).toHaveValue(y+'-'+this.month+'-'+this.day);
    }

    async selectGender(gender: string){
        await this.genderField.click({force: true});
        await this.page.getByTitle(gender,{exact: true}).click();
        await this.expectGender(gender);
    }

    async expectGender(gender: string) {
        await expect(this.page.locator('#root').getByTitle(gender)).toBeVisible();
    }

    async selectDomicile(domicile: string){
        await this.domicileField.fill(domicile);
        await this.page.getByTitle(domicile,{exact: true}).click();
        await this.expectDomicile(domicile);
    }

    async expectDomicile(domicile: string){
        await expect(this.page.locator('.ant-select-selector',{has: this.page.locator('#domicile')}).getByTitle(domicile)).toBeVisible();
    }

    async inputQualification(text: string){
        await clearFieldValue(this.qualificationField);
        await this.qualificationField.fill(text);
        await this.expectQualification(text);
    }

    async expectQualification(text: string){
        await expect(this.qualificationField).toHaveValue(text);
    }

    async validatePersonnelData(data: object) {
        await this.expectPrefix(data['prefix_name']);
        await this.expectFirstName(data['first_name']);
        await this.expectLastName(data['last_name']);
        await this.expectCodeName(data['code_name']);
        await this.expectOrganization(data['organization']);
        await this.expectDepartment(data['department']);
        await this.expectPosition(data['position']);
        await this.expectCommander(data['commander']);
        await this.expectIDCardNumber(data['id_card_number']);
        await this.expectEmail(data['email']);
        await this.expectPhoneNumber(data['phone_number']);
        await this.internalInfoTab.click();
        await this.expectDominate(data['dominate']);
        await this.expectStation(data['station']);
        await this.expectFirstPositionDate(data['first_position_date_time']);
        await this.expectPolicePositionDate(data['police_position_date_time']);
        await this.expectGovernmentDate(data['government_date_time']);
        await this.expectWithdrawMoney(data['withdraw_money']);
        await this.expectPositionAllowance(data['position_allowance']);
        await this.expectExtraBattleMoney(data['extra_battle_money']);
        await this.expectOffendersAdditionalMoney(data['offenders_additional_money']);
        await this.expectRemark(data['note']);
        await this.personalInfoTab.click();
        await this.expectBirthDate(data['date_of_birth']);
        await this.expectGender(data['gender']);
        await this.expectDomicile(data['domicile']);
        await this.expectQualification(data['qualification']);
    }

    async validatePersonnelDataOnlyRequireField(data: object) {
        await this.expectPrefix(data['prefix_name']);
        await this.expectFirstName(data['first_name']);
        await this.expectLastName(data['last_name']);
        await this.expectOrganization(data['organization']);
        await this.expectDepartment(data['department']);
        await this.expectPosition(data['position']);
        await this.expectIDCardNumber(data['id_card_number']);
        await this.expectPhoneNumber(data['phone_number']);
        await this.internalInfoTab.click();
        await this.expectDominate(data['dominate']);
        await this.expectStation(data['station']);
        await this.personalInfoTab.click();
        await this.expectBirthDate(data['date_of_birth']);
        await this.expectGender(data['gender']);
    }

    async setPersonnelStatus(status: boolean){
        if(status === true){
            await this.activeStatus.click();
            await this.page.waitForTimeout(500);
            expect(await this.activeStatus).toHaveAttribute('aria-checked','true');
        }else if(status === false){
            await this.activeStatus.click();
            await this.page.waitForTimeout(500);
            expect(await this.activeStatus).toHaveAttribute('aria-checked','false');
        }
    }
}