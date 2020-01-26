import Vue from 'vue';
import Vuex from 'vuex';
import { LocalStorage, SessionStorage } from 'quasar';


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    checklists: []
  },
  getters: {
    getAllCheckLists(state) {
      return state.checklists;
    },
    /**
     * Filter the Checklists state object to only display the checklist
     * that its "active" attribute set to true.
     */
    getActiveChecklist(state) {
      /**
       * In the event the checklists state is empty, return an empty
       * object.
       */
      if (!state.checklists) {
        return {};
      }
      /**
       * In the event the checklists state exists but has a "length < 1",
       * return an empty object.
       */
      if (state.checklists.length < 1) {
        return {};
      }
      return state.checklists.filter(i => i.active)[0];
    }
  },
  mutations: {
    initLocalStorage(state) {
      state.checklists = LocalStorage.getItem("checklists");
    },
    /**
     * Add a new object to the checklists items array.
     * @param {object} state
     * @param {number} checklistObj
     */
    addNewChecklist(state, checklistObj) {
      /**
       * In the event the checklists state array is null, set it to
       * be an empty array.
       */
      if (!state.checklists) {
        state.checklists = [];
      }

      state.checklists.push(checklistObj);

      if (state.checklists.length === 1) {
        state.checklists[0].active = true;
      }

      /** Add the checklist to localstorage. */
      LocalStorage.set("checklists", state.checklists);
    },
    /**
     * Add a new object to the active checklist's items array.
     * @param {object} state
     * @param {number} itemObj
     */
    addNewChecklistItem(state, itemObj) {
      state.checklists.map(i => {
        if (i.active) {
          i.items.push(itemObj);
        }
      });

      LocalStorage.set("checklists", state.checklists);
    },
    /**
     * When a checklist is selected, filter the checklists array to
     * not include selected checklist items and use this as the new
     * "checklists" state.
     * @param {object} state
     * @param {number} selectedChecklists
     */
    removeSelectedChecklists(state) {
      let nonSelectedChecklistsArray = state.checklists.filter(i => !i.selected);

      /** In the event the active checklist is not included in the
       * filtered array, set the active checklist to the last
       * checklist in the array.
       */
      if (nonSelectedChecklistsArray.filter(i => i.active).length < 1) {
        state.checklists = nonSelectedChecklistsArray;
        if (!state.checklists.length < 1) {
          state.checklists[state.checklists.length - 1].active = true;
        }
      }

      state.checklists = nonSelectedChecklistsArray;

      LocalStorage.set("checklists", state.checklists);
    },
    /**
     * When a checklist item is selected, remove all selected items
     * from the active checklist.
     * @param {object} state
     * @param {number} selectedChecklistItems
     */
    removeSelectedChecklistItems(state, selectedChecklistItems) {
      /** In the event no checklist items are selected, exit the mutation. */
      if (!selectedChecklistItems) {
        return;
      }

      /** Return the active checklist items that are currently selected. */
      let filterChecklistItems = (checklistItems, selectedItems) => {
        let filteredItems = [];
        for (let x = 0; x < checklistItems.length; x++) {
          if (!selectedItems.includes(checklistItems[x])) {
            filteredItems.push(checklistItems[x]);
          }
        }
        return filteredItems;
      };

      for (let x = 0; x < state.checklists.length; x++) {
        if (state.checklists[x].active) {
          state.checklists[x].items = filterChecklistItems(state.checklists[x].items, selectedChecklistItems);
        }
      }

      LocalStorage.set("checklists", state.checklists);
    },
    /**
     * When a checklist is select in the main layout's drawer, set the
     * selected checklist's "selected" attribute to true.
     * @param {object} state
     * @param {number} selectedChecklistId
     */
    setActiveCheckList(state, selectedChecklistId) {
      /**
       * Filter current checklists state array to get the clicked checklist.
       */
      let result = state.checklists.filter(i => {
        /**
         * In the event the currently active checklist's id is the same
         * as the clicked checklist, return nothing in the filtered results.
         */
        if (i.active && (i.id === selectedChecklistId)) {
          return "";
        /**
         * If the checklist's "selected" attribute is false and its "id" is
         * the same as the selected checklist, return the item.
         */
        } else if (!i.active && i.id === selectedChecklistId) {
          return i;
        }
      });

      /**
       * In the event something was returned by the checklist, execute
       * the mutation.
       */
      if (result[0]) {
        let checklists = state.checklists;
        state.checklists.map(i => {
          if (i.id === selectedChecklistId) {
            i.active = true;
          } else {
            i.active = false;
          }
        });
      }

      LocalStorage.set("checklists", state.checklists);
    },
    updateChecklist(state, checklistObj) {
      /**
       * Update the checklist name and description if the checklist has the
       * same id as the passed in checklist object.
       */
      state.checklists.map(i => {
        if (i.id === checklistObj.id) {
          i.name = checklistObj.name;
          i.desc = checklistObj.desc;
        }
      });

      LocalStorage.set("checklists", state.checklists);
    },
    setChecklists(state, updatedChecklistsArray) {
      /**
       * Update the checklists array when the checklists are sorted.
       */
      state.checklists = updatedChecklistsArray;
      LocalStorage.set("checklists", state.checklists);
    },
    updateChecklistItem(state, itemObj) {
      /**
       * Update the clicked checklist item.
       */
      let activeChecklist = state.checklists.filter(i => i.active)[0];
      state.checklists.map(i => {
        if (i.id === activeChecklist.id) {
          i.items.map(i => {
            if (i.id === itemObj.id) {
              i.text = itemObj.text;
            }
          });
        }
      });

      LocalStorage.set("checklists", state.checklists);
    },
    setChecklistItems(state, updatedItemsArray) {
      /**
       * Update the active checklist items when they are sorted.
       */
      let activeChecklist = state.checklists.filter(i => i.active)[0];
      state.checklists.map(i => {
        if (i.id === activeChecklist.id) {
          i.items = updatedItemsArray;
        }
      });

      LocalStorage.set("checklists", state.checklists);
    }
  }
});
