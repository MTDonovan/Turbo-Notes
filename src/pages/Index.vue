<template>
<q-page id="main-notes-index" class="flex flex-left">
  <q-list class="checklist-entities-format">
    <div class="checklist-button-group">
      <q-btn @click="prompt = true" square :disable="disableChecklistItemButtons" class="col-6" color="primary" icon="note_add" />
      <q-btn @click="_removeSelectedChecklistItems()" square :disable="disableChecklistItemButtons" class="col-6" color="secondary" icon="remove_circle"/>
    </div>
    
    <q-item-label v-if="!activeChecklist.id" class="no-active-checklist-found-message">No checklist is currently open.<br><br>Click the hamburger icon at the top left to open the checklists overview.</q-item-label>
    <draggable v-if="activeChecklist" v-model="activeChecklistItems" @start="drag=true" @end="drag=false" handle=".handle">
    
      <q-item class="checklist-item" v-for="(i, k) in activeChecklistItems " :key="k">
        <q-item-section class="col-1" style="margin-right: 12px;">
          <q-checkbox v-model="i.selected"></q-checkbox>
        </q-item-section>
        <q-item-section class="col-8">
          <q-item-label v-if="i.text" @click="openUpdateChecklistItemPrompt(i)">{{ i.text }}</q-item-label>
          <q-item-label v-else @click="openUpdateChecklistItemPrompt(i)"><i>No item text</i></q-item-label>
        </q-item-section>
        <q-item-section class="col-2">
          <q-btn flat icon="menu" class="handle"></q-btn>
        </q-item-section>
      </q-item>
    
    </draggable>

  </q-list>

    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <!-- <q-card-section>
          <div class="text-h6">New checklist item</div>
        </q-card-section> -->
        <q-card-section>
        <q-input placeholder="Enter item text" dense v-model="tempItemText" autofocus @keyup.enter="_addNewChecklistItem()" />
        </q-card-section>
        <q-card-actions align="left" class="text-primary">
          <q-btn @click="_addNewChecklistItem()" flat label="Add" v-close-popup />
          <q-btn flat label="Cancel" v-close-popup @click="closePrompt()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="updateItemPrompt" persistent>
      <q-card style="min-width: 350px">
        <!-- <q-card-section>
          <div class="text-h6">Update checklist item</div>
        </q-card-section> -->
        <q-card-section>
          <q-input placeholder="Update item text" dense v-model="tempItemText" autofocus @keyup.enter="_updateChecklistItem()" />
        </q-card-section>
        <q-card-actions align="left" class="text-primary">
          <q-btn @click="_updateChecklistItem()" flat label="Update" v-close-popup />
          <q-btn flat label="Cancel" v-close-popup @click="closePrompt()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    
    <!-- <q-footer class="flex flex-center">
      <q-btn-group style="width: 100%">
        <q-btn @click="prompt = true" :disable="disableChecklistItemButtons" class="col-6" color="primary" glossy label="Create" />
        <q-btn @click="_removeSelectedChecklistItems()" :disable="disableChecklistItemButtons" class="col-6" color="secondary" glossy label="Remove" />
      </q-btn-group>
    </q-footer> -->
  </q-page>
</template>

<script>
const crypto = require("crypto");
import draggable from 'vuedraggable';


export default {
  name: 'PageIndex',
  components: {
    draggable
  },
  data() {
    return {
      prompt: false,
      tempItemText: "",
      updateItemPrompt: false,
      updateChecklistItemObj: {}
    }
  },
  computed: {
    activeChecklist() {
      return this.$store.getters.getActiveChecklist;
    },
    activeChecklistItems: {
      get() {
        return this.$store.getters.getActiveChecklist.items;
      },
      set(updatedItemsArray) {
        this.$store.commit("setChecklistItems", updatedItemsArray);
      }
    },
    disableChecklistItemButtons() {
      if (!this.$store.state.checklists) {
        return false;
      }
      return this.$store.state.checklists.length >= 1 ? false : true;
    }
  },
  mounted() {
    console.log(`[index page] Mounted with active checklist "${this.$store.getters.getActiveChecklist.name}"`);
    this.updatePageDimensions();
    this.$nextTick(() => {
      window.addEventListener("resize", () => {
        this.updatePageDimensions();
      });
    });
  },
  methods: {
    waitForDocumentElement(selector) {
      return new Promise((resolve, reject) => {
        let waitForElementToDisplay = (selector, time) => {
          if (document.querySelector(selector) != null) {
            resolve(document.querySelector(selector));
          } else {
            setTimeout(() => {
              waitForElementToDisplay(selector, time);
            }, time);
          }
        }
        waitForElementToDisplay(selector, 100);
      });
    },
    updatePageDimensions() {
      this.waitForDocumentElement(".checklist-item").then(element => {
        document
          .querySelector(".checklist-button-group")
          .setAttribute("style", `width: ${(window.innenrWidth * (30 / 100)).toString()}px;`);
        element
          .setAttribute("style", `width: ${(window.innerWidth * (80 / 100)).toString()}px;`);
        console.log("[index page] Updated checklist page dimensions");
      })
    },
    filterForSelectedChecklistItems() {
      return this.activeChecklistItems.filter(i => i.selected);
    },
    generateId() {
      return crypto.randomBytes(16).toString("hex");
    },
    _addNewChecklistItem() {
      let itemObj = {
        id      : this.generateId(),
        selected: false,
        text    : this.tempItemText
      };
      this.$store.commit("addNewChecklistItem", itemObj);

      /** Reset the relevant data points. */
      this.prompt = false;
      this.tempItemText = "";

      /** Update checklist page dimensions */
      this.updatePageDimensions();
    },
    _removeSelectedChecklistItems() {
      this.$store.commit("removeSelectedChecklistItems", this.filterForSelectedChecklistItems());
    },
    openUpdateChecklistItemPrompt(checklistItemObj) {
      this.updateItemPrompt       = true;
      this.updateChecklistItemObj = checklistItemObj;
      this.tempItemText           = checklistItemObj.text;
    },
    _updateChecklistItem() {
      this.updateChecklistItemObj.text = this.tempItemText;
      this.$store.commit("updateChecklistItem", this.updateChecklistItemObj);
      this.updateChecklistItemObj = {};
      this.tempItemText = "";
      this.updateItemPrompt = false;
    },
    closePrompt() {
      this.tempItemText = "";
      /**
       * The prompt is toggled to "false" by the "v-close-popup" attribute
       * on the popup's "Cancel" button.
       */
    }
  }
}
</script>
