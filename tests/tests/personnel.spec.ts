import { test, expect, Page, chromium } from '@playwright/test';
import { HomePage, LoginPage, makePhone, thaiIdCardGenerate} from '../pageObject/index';
import { InvestigateTeamPage } from '../pageObject/personnel/investigateTeamPage';
import { PersonnelPage } from '../pageObject/personnel/personnelPage'
import { TD_PER001_01, TD_PER001_02, TD_PER001_03, create_personnel,
  TD_PER001_04, TD_PER001_06, TD_PER001_07, TD_PER002_01, create_personnel2,
  create_personnel3,create_personnel4, TD_PER002_02, create_investigative_team, TD_PER002_03,
  TD_PER002_04} from '../testData/testData'
import { api, personnel_report_data } from '../testResult/testResult';

test.describe.configure({ mode: 'serial' });

let page: Page;
let resLogin : object;
test.beforeAll( async({browser}) => {
  page = await browser.newPage();
  await page.goto('https://dev.udoncop.com/auth/login');
  const loginPage = new LoginPage(page);
  resLogin = await loginPage.login('1000000001','Test123456*');
})

test.describe('PersonnelOld',() => {
  test.beforeEach(async() => {
      const homePage = new HomePage(page);
      await homePage.gotoPersonnel();
  })

  test.afterEach(async() => {
      const homePage = new HomePage(page);
      await homePage.gotoHomePage();
  })

  test('TC_PER001-01 - Create PersonnelOld Successful', async() => {
      const personnel = new PersonnelPage(page);
      const login = new LoginPage(page);
      let testData = await personnel.prepareTestData(TD_PER001_01);
      testData = await personnel.createPersonnelSuccessCase(testData);
      await personnel.validatePersonnelDetail(testData);
      await login.loginByApiSuccess(testData['email'],testData['password']);
  })

  test('TC_PER001-02 - Create PersonnelOld Duplicate Data',async () => {
      const personnel = new PersonnelPage(page);
      const testData = {
        ...TD_PER001_02,
        email:'testAutomation00198@udoncop.com',
        phone_number: await makePhone(),
      };
      await personnel.createPersonnelErrorCase(testData);
      await page.goBack();
      const testData2 = {
        ...TD_PER001_02,
        phone_number: await makePhone(),
        id_card_number: await thaiIdCardGenerate(),
      };
      await personnel.createPersonnelErrorCase(testData2);
      await page.goBack();
      const testData3 = {
        ...TD_PER001_02,
        email:'testAutomation00199@udoncop.com',
        id_card_number: await thaiIdCardGenerate(),
      };
      await personnel.createPersonnelErrorCase(testData3);
  })

  test('TC_PER001_03 - Edit PersonnelOld Successful', async({request}) => {
    const login = new LoginPage(page);
    const personnel = new PersonnelPage(page);
    let createPersonnelBody = await personnel.prepareTestDataforAPI(create_personnel);
    let testData = await personnel.prepareTestData(TD_PER001_03);
    const res_json = await personnel.createPersonnelByApi(request,createPersonnelBody,resLogin['data']['id_token']);
    testData['_id'] = res_json['data']['personnel_id'];
    console.log(testData['_id']);

    await page.reload();

    await page.waitForResponse(resp =>
      resp.url().includes('v1/personnel?hotfix=personnel-list') && resp.status() === 200
    )

    await personnel.editPersonnelSuccessCase(testData);
    const homePage = new HomePage(page);
    await homePage.gotoHomePage();
    await homePage.gotoPersonnel();
    await personnel.validatePersonnelDetail(testData);
    await login.loginByApiSuccess(testData['email'],'Test123456*');
  })

  test('TC_PER001-04 - Edit PersonnelOld Duplicate Data',async () => {
    const personnel = new PersonnelPage(page);
    const testData = {
      ...TD_PER001_04,
      email:'testAutomation00201@udoncop.com',
      phone_number: await makePhone(),
    };
    await page.reload();
    await page.waitForResponse(resp =>
      resp.url().includes('v1/personnel?hotfix=personnel-list') && resp.status() === 200
    )

    await personnel.editPersonnelErrorCase(testData);
    await page.goBack();
    const testData2 = {
      ...TD_PER001_04,
      phone_number: await makePhone(),
      id_card_number: await thaiIdCardGenerate(),
    };
    await page.waitForResponse(resp =>
      resp.url().includes('v1/personnel?hotfix=personnel-list') && resp.status() === 200
    )

    await personnel.editPersonnelErrorCase(testData2);
    await page.goBack();
    const testData3 = {
      ...TD_PER001_04,
      email:'testAutomation00202@udoncop.com',
      id_card_number: await thaiIdCardGenerate(),
    };
    await page.waitForResponse(resp =>
      resp.url().includes('v1/personnel?hotfix=personnel-list') && resp.status() === 200
    )

    await personnel.editPersonnelErrorCase(testData3);

  })

  test('TC_PER001-05 - Export PersonnelOld Data', async() => {
    const personnel = new PersonnelPage(page);
    await personnel.personnelListExport('excel',personnel_report_data);
    await personnel.personnelListExport('csv',personnel_report_data);

  })

  test('TC_PER001-06 - PersonnelOld Status is Inactive', async({request}) => {
    const login = new LoginPage(page);
    const personnel = new PersonnelPage(page);
    let testData = await personnel.prepareTestDataforAPI(TD_PER001_06);
    const res_json = await personnel.createPersonnelByApi(request,testData,resLogin['data']['id_token']);
    testData['_id'] = res_json['data']['personnel_id'];
    await page.reload();
    await page.waitForResponse(resp =>
      resp.url().includes('v1/personnel?hotfix=personnel-list') && resp.status() === 200
    )
    await personnel.changePersonnelStatus(false,testData);
    await login.loginByApiError(testData['email'],testData['password']);
  })

  test('TC_PER001-07 - PersonnelOld Status is Active', async({request}) => {
    const login = new LoginPage(page);
    const personnel = new PersonnelPage(page);
    let testData = await personnel.prepareTestDataforAPI(TD_PER001_07);
    const res_json = await personnel.createPersonnelByApi(request,testData,resLogin['data']['id_token']);
    testData['_id'] = res_json['data']['personnel_id'];
    await page.reload();
    await page.waitForResponse(resp =>
      resp.url().includes('v1/personnel?hotfix=personnel-list') && resp.status() === 200
    )
    await personnel.changePersonnelStatus(true,testData);
    await login.loginByApiSuccess(testData['email'],testData['password']);
  })

  test('TC_PER002-01 - Create Investigative Team Successful',async({request}) => {
    const invesTeam = new InvestigateTeamPage(page);
    let testData = TD_PER002_01
    const newTestData = await invesTeam.prepareTestData(request, testData, resLogin['data']['id_token'], create_personnel2, create_personnel3, create_personnel4);
    await invesTeam.gotoInvestigateTeamMenu();
    await invesTeam.createInvestigateTeamSuccessCase(newTestData);
    // console.log(testData)
  })

  test('TC_PER002-02 - Create Investigative Team Duplicate Data',async() => {
    const invesTeam = new InvestigateTeamPage(page);
    let testData = TD_PER002_02
    await invesTeam.gotoInvestigateTeamMenu();
    await invesTeam.createInvestigateTeamErrorCase(testData);
  })

  test('TC_PER002-03 - Edit Investigative Team Success',async({request}) => {
    const invesTeam = new InvestigateTeamPage(page);
    let testData = TD_PER002_03
    const newTestData = await invesTeam.prepareTestData(request, testData, resLogin['data']['id_token'], create_personnel2, create_personnel3, create_personnel4);
    const genData = await invesTeam.prepareTestDataForApi(request,create_investigative_team,resLogin['data']['id_token'],create_personnel2);
    const res_obj = await invesTeam.createInvestigateTeamByApi(request,genData,resLogin['data']['id_token']);
    await invesTeam.gotoInvestigateTeamMenu();
    await invesTeam.editInvestigateTeamSuccessCase(newTestData,genData);
  })

  test('TC_PER002-04 - Edit Investigative Team Duplicate Data',async({request}) => {
    const invesTeam = new InvestigateTeamPage(page);
    const testData = TD_PER002_04;
    const genData = await invesTeam.prepareTestDataForApi(request,create_investigative_team,resLogin['data']['id_token'],create_personnel2);
    const res_obj = await invesTeam.createInvestigateTeamByApi(request,genData,resLogin['data']['id_token']);
    testData['team_within']['leader']['name'] = genData['team_within']['leader']['name'];
    testData['team_within']['leader']['_id'] = genData['team_within']['leader']['_id'];
    console.log(genData['team_name']);
    console.log(testData['team_name']);
    await invesTeam.gotoInvestigateTeamMenu();
    await invesTeam.editInvestigateTeamErrorCase(genData,testData);
  })

})

