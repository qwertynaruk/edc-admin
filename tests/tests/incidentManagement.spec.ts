import { test, expect, Page, chromium } from '@playwright/test';
import { LoginPage } from '../pageObject/loginPage';
import { HomePage } from '../pageObject/homePage';
import { IncidentManagementPage, DailyReport } from '../pageObject/IncidentManagement/incidentManagementPage'
import { dailyReportTD, internalReportTD, ondutyReportTD } from '../testData/testData'

test.describe.configure({ mode: 'serial' });

let page: Page
test.beforeAll( async({browser}) => {
  page = await browser.newPage();
  await page.goto('https://dev.udoncop.com/auth/login');
  const loginPage = new LoginPage(page);
  await loginPage.login('tester@udoncop.com','Test123456*');
})

test.afterEach(async() => {  
  const homePage = new HomePage(page);
  await homePage.gotoHomePage();
})

test.skip('create Evidence Document Report', async() => {
  const homePage = new HomePage(page)
  await homePage.gotoIncidentManagement()

  const incidentPage = new IncidentManagementPage(page);
  await incidentPage.createDailyReport(dailyReportTD)
})

test.skip('create Capture Report', async() => {
  const homePage = new HomePage(page)
  await homePage.gotoIncidentManagement()

  const incidentPage = new IncidentManagementPage(page);
  await incidentPage.gotoInternalReport();
  await incidentPage.createInternalReport(internalReportTD)
})


test.skip('Input Data to Lost Document Report', async() => {
  await page.goto('https://dev.udoncop.com/app/incident-management/report/daily/management/63db3b8b18e5cb7dfba24840')
  
  const dailyReport = new DailyReport(page);
  await dailyReport.lostDocumentReport();

  await page.getByText('หมายเลขรายงาน :').click()
})

