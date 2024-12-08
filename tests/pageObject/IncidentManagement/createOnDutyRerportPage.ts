import { expect, Locator, Page } from "@playwright/test";

export class CreateOnDutyReportPage {
    readonly page: Page;
    readonly eventName: Locator;
    readonly source: Locator;
    readonly OffenceType: Locator;
    readonly plaint: Locator;
    readonly startDate: Locator;
    readonly inquisitor: Locator;
    readonly investigator: Locator;
    readonly suppression: Locator;
    readonly locationSearch: Locator;
    readonly venueType: Locator;
    readonly homeNumber: Locator;
    readonly villageGroupNumber: Locator;
    readonly subAlley: Locator;
    readonly roadName: Locator;
    readonly province: Locator;
    readonly city: Locator;
    readonly district: Locator;
    readonly zipCode: Locator;
    readonly liableStation: Locator;
    readonly inspectionArea: Locator;
    readonly cancelBtn: Locator;
    readonly submitBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.eventName = page.locator('#notification_event_name');
        this.source = page.locator('#notification_source');
        this.OffenceType = page.locator('#notification_offense_type');
        this.plaint = page.locator('#notification_plaint');
        this.startDate = page.locator('#notification_start_date');
        this.inquisitor = page.locator('#notification_officer_and_result_investigator');
        this.investigator = page.locator('#notification_officer_and_result_inquisitor');
        this.suppression = page.locator('#notification_officer_and_result_suppression');
        this.locationSearch = page.getByPlaceholder('ค้นหาสถานที่..');
        this.venueType = page.locator('#notification_venue_type');
        this.homeNumber = page.locator('#notification_venue_home_number');
        this.villageGroupNumber = page.locator('#notification_venue_village_group_number');
        this.subAlley = page.locator('#notification_venue_sub_alley');
        this.roadName = page.locator('#notification_venue_roadname');
        this.province = page.locator('#province');
        this.city = page.locator('#city');
        this.district = page.locator('#district');
        this.zipCode = page.locator('#zipcode');
        this.liableStation = page.locator('#notification_venue_liable_station');
        this.inspectionArea = page.locator('#notification_venue_inspection_area');
        this.cancelBtn = page.getByRole('button', { name: 'ยกเลิก' });
        this.submitBtn = page.getByRole('button', { name: 'บันทึก' });
    }

}