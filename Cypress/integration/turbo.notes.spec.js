/// <reference types="cypress" />
import CheckListOverview from '../support/page-objects/CheckListOverview';

describe('visit the app\'s default empty state view', () => {
  /**
   * Open the correct localhost port and set change the browser to a mobile viewport.
   */
  before(() => {
    cy.visit('http://localhost:8080/#/');
  });

  beforeEach(() => {
    cy.setMobileViewport();
  });

  it('checklist overview shall have a visible overview with empty state text when app is launched without data', () => {
    const checkListOverview = new CheckListOverview();
    checkListOverview.checkOverviewEmptyState();
  });

  it('checklist overview shall be closed when the "close" button is clicked', () => {
    const checkListOverview = new CheckListOverview();
    checkListOverview.clickOverviewCloseButton();
  });

  it('checklist overview shall be open when the "open" button is clicked', () => {
    const checkListOverview = new CheckListOverview();
    checkListOverview.clickOverviewOpenButton();
    checkListOverview.checkOverviewEmptyState();
  });

  it('user shall have the ability to add a new checklist to an empty state overview', () => {
    const checkListOverview = new CheckListOverview();
    var fn = (checkListName, checkListDescription, index) => {
      checkListOverview.addNewCheckListToOverview(checkListName, checkListDescription);
      checkListOverview.checkCheckListItemInOverview(checkListName, checkListDescription, index);
    };
    fn('Checklist #1', 'This is my #1 checklist, for the time being.', 0);
    fn('Checklist #2', 'This is my #2 checklist, for the time being.', 1);
  });

  it('user shall have the ability to cancel a checklist creation attempt', () => {
    const checkListOverview = new CheckListOverview();
    checkListOverview.clickCreateCheckListButton();
    checkListOverview.checkOverviewModalEmptyState();
    checkListOverview.getNewCheckListNameInput().type("Cancelled Checklist");
    checkListOverview.getNewCheckListDescriptionInput().type("This checklist shall not be created.");
    checkListOverview.clickCancelCheckListButton();
  });

  it('user shall have the ability to edit an existing checklist', () => {
    const checkListOverview = new CheckListOverview();
    checkListOverview.updateExistingCheckList('Checklist #1 -edited', 'This is my #1 checklist, for the time being. -edited', 0);
  });

  // it('user shall have the ability to remove all checklists from overview', () => {
  //   const checkListOverview = new CheckListOverview();
  //   checkListOverview.selectCheckListCheckBoxes();
  //   checkListOverview.clickRemoveCheckListButton();
  // });

  it('user shall have the ability to change the active checklist', () => {
    const checkListOverview = new CheckListOverview();
    checkListOverview.setActiveCheckListItem('index', 1);
  });

});