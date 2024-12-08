import { expect, Locator, Page } from "@playwright/test";
import { Header } from "./header";

export class HomePage {
    readonly page: Page;
    readonly advanceSearchModule: Locator;
    readonly masterIndicesModule: Locator;
    readonly incidentManagementModule: Locator;
    readonly investigativeCaseManagementModule: Locator;
    readonly propertyAndEvidenceManagementModule: Locator;
    readonly patrolManagementModule: Locator;
    readonly oneCommandModule: Locator;
    readonly assetManagementModule: Locator;
    readonly personnelModule: Locator;
    readonly systemAdminModule: Locator;

    constructor(page: Page) {
        this.page = page;
        this.advanceSearchModule = page.getByText('Advanced Search');
        this.masterIndicesModule = page.getByText('Master Indices');
        this.incidentManagementModule = page.getByText('Incident Management');
        this.investigativeCaseManagementModule = page.getByText('Investigative Case Management');
        this.propertyAndEvidenceManagementModule = page.getByText('Property and Evidence Management');
        this.patrolManagementModule = page.getByText('Patrol Management');
        this.oneCommandModule = page.getByText('One Command');
        this.assetManagementModule = page.getByText('Asset Management');
        this.personnelModule = page.getByText('PersonnelOld');
        this.systemAdminModule = page.getByText('System Administration');
    }

    async gotoHomePage() {
        const header = new Header(this.page);
        await header.homeBtn.click();
    }

    async gotoIncidentManagement() {
        await this.incidentManagementModule.click();
    }

    async gotoMasterIndices() {
        await this.masterIndicesModule.click();
    }

    async gotoAdvanceSearch() {
        await this.advanceSearchModule.click();
    }

    async gotoInvestigativeCaseManagement() {
        await this.investigativeCaseManagementModule.click();
    }

    async gotoPropertyAndEvidenceManagement() {
        await this.propertyAndEvidenceManagementModule.click();
    }

    async gotoPatrolManagement() {
        await this.patrolManagementModule.click();
    }

    async gotoOneCommand() {
        await this.oneCommandModule.click();
    }

    async gotoAssetManagement() {
        await this.assetManagementModule.click();
    }

    async gotoPersonnel() {
        await this.personnelModule.click();
        await expect(this.page).toHaveURL(/app\/personnel/)
    }

    async gotoSystemAdministration() {
        await this.systemAdminModule.click();
    }
}
