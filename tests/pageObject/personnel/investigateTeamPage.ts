import { expect, Locator, Page } from "@playwright/test";
import { api } from "../../testResult/testResult";
import { clearFieldValue, Header } from "../index";
import { providerSubmitNotification, makeid } from "../index";
import { PersonnelPage } from "./personnelPage";

export class InvestigateTeamPage{
    readonly page: Page;
    readonly teamTitle: Locator;
    readonly addTeamBtn: Locator;
    readonly searchField: Locator;
    readonly searchBtn: Locator;
    readonly mainAgency: Locator;
    readonly teamName: Locator;
    readonly details: Locator;
    readonly teamWithinLeader: Locator;
    readonly addOperationOfficerBtn: Locator;
    readonly cancelBtn: Locator;
    readonly submitBtn: Locator;
    officerField: Locator;
    officerList: Locator;
    readonly successNotification: Locator;
    readonly errorNotification: Locator;
    responseObj: object;
    dataObj : object;
    readonly deleteOfficer: Locator;
    
    constructor(page: Page){
        this.page = page;
        this.teamTitle = page.getByRole('heading', { name: 'ชุดปฏิบัติการ' });
        this.addTeamBtn = page.getByRole('button', { name: 'เพิ่ม' });
        this.searchField = page.getByPlaceholder('ค้นหาชุดปฏิบัติการ');
        this.searchBtn = page.getByRole('button', { name: 'search' });
        this.mainAgency = page.locator('#main_agency');
        this.teamName = page.locator('#team_name');
        this.details = page.locator('#details');
        this.teamWithinLeader = page.locator('#team_within_leader');
        this.addOperationOfficerBtn = page.getByRole('button', { name: 'เพิ่มเจ้าหน้าที่' });
        this.cancelBtn = page.getByRole('button', { name: 'ยกเลิก' });
        this.submitBtn = page.getByRole('button', { name: 'บันทึก' });
        this.successNotification = page.locator('.notification-success');
        this.errorNotification = page.locator('.notification-error');
        this.deleteOfficer = page.getByRole('button', { name: 'delete' });
    }

    async prepareTestData(request,data: object,token: string,leaderObj: object,officer1Obj: object,officer2Obj: object){
        const personnel = new PersonnelPage(this.page);
        let leader = await personnel.prepareTestDataforAPI(leaderObj);
        const res_json = await personnel.createPersonnelByApi(request,leader,token);
        let officer1 = await personnel.prepareTestDataforAPI(officer1Obj);
        let officer2 = await personnel.prepareTestDataforAPI(officer2Obj);
        officer1['manager'] = res_json['data']['personnel_id'];
        officer2['manager'] = res_json['data']['personnel_id'];
        const res_json2 = await personnel.createPersonnelByApi(request,officer1,token);
        const res_json3 = await personnel.createPersonnelByApi(request,officer2,token);
        const obj = {
        _id: res_json2['data']['personnel_id'],
        name: officer1['first_name']+' '+officer1['last_name'],
        }
        const obj2 = {
        _id: res_json3['data']['personnel_id'],
        name: officer2['first_name']+' '+officer2['last_name'],
        }
        const obj3 = {
        _id: res_json['data']['personnel_id'],
        name: leader['first_name']+' '+leader['last_name']
        }
        data['team_within']['leader'] = obj3;
        data['operation_officers'] = [obj,obj2];
        const mid = makeid(4);
        data['team_name'] = 'ชุดสืบสวน'+mid;
        return data
    }

    async prepareTestDataForApi(request,data: object,token: string,leaderObj: object){
        const personnel = new PersonnelPage(this.page);
        let leader = await personnel.prepareTestDataforAPI(leaderObj);
        const res_json = await personnel.createPersonnelByApi(request,leader,token);
        const obj = {
            _id: res_json['data']['personnel_id'],
            name: leader['first_name']+' '+leader['last_name'] 
        }
        data['team_within']['leader'] = obj;
        const mid = makeid(4);
        data['team_name'] = 'ชุดสืบสวน'+mid;
        return data
    }

    async createInvestigateTeamByApi(request,body: object,token: string){
        const res_api = await request.post(api['investigate_team']['create']['url'],{
            headers: {
                authorization: token,
              },
              data: body,
        })
        expect(res_api.ok()).toBeTruthy();
        const res_json = await res_api.json();
        return res_json
    }

    async setOfficerFieldLocator(locat: string){
        this.officerField = this.page.locator(`#operation_officers_${locat}`)
    }

    async setOfficerListLocator(locat: string){
        this.officerList =this.page.locator(`#operation_officers_${locat}_list`)
    }

    async gotoInvestigateTeamMenu() {
        const header = new Header(this.page);
        await header.teamManagementMenu.click();
        await expect(this.page).toHaveURL(/app\/personnel\/team/);
        await expect(this.teamTitle).toBeVisible();
    }

    async clickAddTeamBtn() {
        await this.addTeamBtn.click();
    }

    async createInvestigateTeamSuccessCase(data: object){
        this.dataObj = data;
        await this.clickAddTeamBtn();
        await this.inputInvestigateTeamData(data);
        data = await this.submitCreateSuccessCase();
        return data;
    }

    async createInvestigateTeamErrorCase(data: object){
        await this.clickAddTeamBtn();
        await this.inputInvestigateTeamDataOnlyRequireField(data);
        await this.submitCreateErrorCase()
    }

    async inputInvestigateTeamData(data: object){
        await this.selectMainAgency(data['main_agency']);
        await this.inputTeamName(data['team_name']);
        await this.inputDetail(data['details']);
        await this.selectLeader(data['team_within']['leader']['name']);
        await this.addOperationOfficer(data['operation_officers']);
    }

    async inputInvestigateTeamDataOnlyRequireField(data: object){
        await this.selectMainAgency(data['main_agency']);
        await this.inputTeamName(data['team_name']);
        await this.inputDetail(data['details']);
        await this.selectLeader(data['team_within']['leader']['name']);
    }

    async editInvestigateTeamDataOnlyRequireField(data: object){
        await this.selectMainAgency(data['main_agency']);
        await this.inputTeamName(data['team_name']);
        await this.inputDetail(data['details']);
    }

    async selectMainAgency(department: string){
        await this.mainAgency.click({force:true});
        await this.page.locator('div',{has: this.page.locator('#main_agency_list')}).getByTitle(department,{exact: true}).click();
        await this.expectMainAgency(department);
    }

    async expectMainAgency(department: string){
        await expect(this.page.locator('.ant-select-selector',{has: this.mainAgency}).getByTitle(department,{exact: true})).toBeVisible();
    }

    async inputTeamName(name: string){
        await clearFieldValue(this.teamName);
        await this.teamName.fill(name);
        await this.expectTeamName(name);
    }

    async expectTeamName(name: string){
        await expect(this.teamName).toHaveValue(name);
    }

    async inputDetail(detail:string){
        await clearFieldValue(this.details);
        await this.details.fill(detail);
        await this.expectDetail(detail);
    }

    async expectDetail(detail:string){
        await expect(this.details).toHaveValue(detail);
    }

    async selectLeader(name:string){
        await this.teamWithinLeader.fill(name);
        await this.page.locator('div',{has: this.page.locator('#team_within_leader_list')}).getByTitle(name).click();
    }

    async expectLeader(name:string){
        await expect(this.page.locator('.ant-select-selector',{has: this.teamWithinLeader}).getByTitle(name)).toBeVisible();
    }

    async addOperationOfficer(obj: object[]){
        for (let index = 0; index < obj.length; index++) {
            const element = obj[index];
            await this.addOperationOfficerBtn.click();
            await this.setOfficerFieldLocator(index+'');
            await this.setOfficerListLocator(index+'');
            await this.officerField.fill(element['name']);
            await this.page.locator('div',{has: this.officerList}).getByTitle(element['name']).click();
        }
        await this.expectOperationOfficer(obj);
    }

    async expectOperationOfficer(obj:object[]){
        for (let index = 0; index < obj.length; index++) {
            const element = obj[index];
            await this.setOfficerFieldLocator(index+'');
            await this.setOfficerListLocator(index+'');
            await expect(this.page.locator('.ant-select-selector',{has: this.officerField}).getByTitle(element['name'])).toBeVisible();
        }
    }

    async submitCreateSuccessCase() {
        this.responseObj = await providerSubmitNotification(this.page,this.submitBtn,this.successNotification,'investigate_team','create','success');
        this.dataObj['_id'] = this.responseObj['obj_id']
        return this.dataObj;
    }

    async submitCreateErrorCase() {
        await providerSubmitNotification(this.page,this.submitBtn,this.errorNotification,'investigate_team','create','error');
    }

    async searchInvestigateTeam(name: string) {
        await this.searchField.fill(name);
        await this.searchBtn.click();
    }

    async selectTeamFromListByName(name: string){
        await this.page.locator('[role="menuitem"]',{hasText: name}).click();
        await expect(this.teamName).toHaveValue(name);
    }

    async deleteAllOfficer(){
        const cnt = await this.deleteOfficer.count();
        for (let index = 0; index < cnt; index++) {
            await this.deleteOfficer.nth(index).click();
        }
    }

    async submitEditSuccess(){
        await providerSubmitNotification(this.page,this.submitBtn,this.successNotification,'investigate_team','edit','success');
    }

    async submitEditError(){
        await providerSubmitNotification(this.page,this.submitBtn,this.errorNotification,'investigate_team','edit','error');
    }

    async editInvestigateTeamSuccessCase(newData: object,oldData:object) {
        await this.searchInvestigateTeam(oldData['team_name']);
        await this.selectTeamFromListByName(oldData['team_name'])
        await this.deleteAllOfficer();
        await this.editInvestigateTeamDataOnlyRequireField(newData);
        await this.submitEditSuccess();
    }

    async editInvestigateTeamErrorCase(newData: object,oldData:object) {
        await this.searchInvestigateTeam(newData['team_name']);
        await this.selectTeamFromListByName(newData['team_name'])
        await this.deleteAllOfficer();
        await this.editInvestigateTeamDataOnlyRequireField(oldData);
        await this.submitEditError();
    }
}