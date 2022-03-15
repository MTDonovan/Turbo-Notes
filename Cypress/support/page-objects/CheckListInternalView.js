class CheckListInternalView {

  getInternalChecklistContainer() {
    return cy.get('[name="internal checklist view"]');
  }

  checkOverviewEmptyState() {
    this.getInternalChecklistContainer().should('be.visible');
    this.getInternalChecklistContainer().contains('No checklist is currently open.');
    this.getInternalChecklistContainer().contains('Click the hamburger icon at the top left to open the checklists overview.');
  }

  getAddCheckListItemButton() {
    return cy.get('[name="add new checklist item"]');
  }

  clickAddCheckListButton() {
    this.getAddCheckListItemButton().click();
  }

  getCheckListModal() {
    return cy.get('.q-card');
  }

  checkModelEmptyState() {
    // this.getCheckListModal().get('[placeholder="Enter checklist item text"]')
    this.getCheckListModal().contains('Enter checklist item text');
  }

  getNewCheckListModalInput() {
    return this.getCheckListModal().get('[name="new checklist item name input"]');
  }

  clickNewCheckListModalAddButton() {
    this.getCheckListModal().get('button').contains('Add').click();
  }

  clickNewCheckListModalCancelButton() {
    this.getCheckListModal().get('button').contains('Cancel').click();
  }
}

export default CheckListInternalView;