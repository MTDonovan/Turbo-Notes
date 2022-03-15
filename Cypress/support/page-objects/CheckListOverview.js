class CheckListOverview {

  getOverviewContainer() {
    return cy.get('aside');
  }
  
  clickOverviewCloseButton() {
    cy.get('button[aria-label="close checklist overview"]').click();
  }

  clickOverviewOpenButton() {
    cy.get('button[aria-label="open checklist overview"]').click();
  }

  clickCreateCheckListButton() {
    this.getOverviewContainer().get('button').contains('Create').click();
  }

  clickRemoveCheckListButton() {
    this.getOverviewContainer().get('button').contains('Remove').click();
  }

  getCheckListModal() {
    return cy.get('.q-card');
  }

  checkOverviewEmptyState() {
    this.getOverviewContainer().should('be.visible');
    this.getOverviewContainer().contains('Checklists');
    this.getOverviewContainer().contains('Click "Create" to start a new checklist');
  }

  checkOverviewModalEmptyState() {
    this.getCheckListModal().should('be.visible');
    this.getCheckListModal().get('input[placeholder="Enter checklist name"]').should('be.visible');
    this.getCheckListModal().get('input[placeholder="Enter checklist description (optional)"]').should('be.visible');
  }

  getNewCheckListNameInput() {
    return this.getCheckListModal().get('input[name="enter checklist name"]');
  }

  getNewCheckListDescriptionInput() {
    return this.getCheckListModal().get('input[name="enter checklist description"]');
  }

  getUpdatedCheckListNameInput() {
    return this.getCheckListModal().get('input[name="update checklist name"]');
  }

  getUpdatedCheckListDescriptionInput() {
    return this.getCheckListModal().get('input[name="update checklist description"]');
  }

  clickAddCheckListButton() {
    this.getCheckListModal().get('button').contains("Add").click();
  }

  clickUpdateCheckListButton() {
    this.getCheckListModal().get('button').contains("Update").click();
  }

  addNewCheckListToOverview(checkListName, checkListDescription) {
    this.clickCreateCheckListButton();
    this.checkOverviewModalEmptyState();
    this.getNewCheckListNameInput().type(checkListName);
    this.getNewCheckListDescriptionInput().type(checkListDescription);
    this.clickAddCheckListButton();
  }

  clickCancelCheckListButton() {
    this.getCheckListModal().get('button').contains("Cancel").click();
  }

  getAllCheckListItems() {
    return cy.get('[name="checklist overview item"]');
  }

  getCheckListItem(by, value) {
    switch (by) {
      case 'name':
        return this.getAllCheckListItems().contains(value);
      case 'index':
      default:
        return this.getAllCheckListItems().eq(value);
    }
  }

  setActiveCheckListItem(by, value) {
    switch (by) {
      case 'name':
        return this.getCheckListItem(by, value).get('[name="set active checklist"]').contains(value).click();
      case 'index':
      default:
        return this.getCheckListItem(by, value).get('[name="set active checklist"]').eq(value).click();
    }
  }

  /**
   * Verify that a checklist item at a given index has the correct name and description.
   * @param {string} checkListName Expected checklist item name text.
   * @param {string} checkListDescription Expected checklist item description text.
   * @param {number} index Index of the checklist item in the overview.
   */
  checkCheckListItemInOverview(checkListName, checkListDescription, index) {
    this.getCheckListItem('index', index).get('[name="checklist name"]').should('contain', checkListName);
    this.getCheckListItem('index', index).get('[name="checklist description"]').should('contain', checkListDescription);
  }

  updateExistingCheckList(checkListName, checkListDescription, index) {
    this.getCheckListItem('index', index).click();
    this.getUpdatedCheckListNameInput().clear();
    this.getUpdatedCheckListNameInput().type(checkListName);
    this.getUpdatedCheckListDescriptionInput().clear();
    this.getUpdatedCheckListDescriptionInput().type(checkListDescription);
    this.clickUpdateCheckListButton();
  }

  getCheckListCheckBoxes() {
    return this.getAllCheckListItems().get('[role="checkbox"]');
  }

  selectCheckListCheckBoxes() {
    this.getCheckListCheckBoxes().each(($el, index, $list) => {
      $el.click();
    });
  }
}

export default CheckListOverview;