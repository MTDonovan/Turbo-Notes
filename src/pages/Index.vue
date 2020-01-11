<template>
<q-page id="main-notes-index" class="flex flex-left">
  <q-list>
    <q-item class="checklist-item" v-if="activeChecklist" v-for="(i, k) in activeChecklistItems " :key="k">
      <q-item-section class="col-2" style="margin-right: 12px;">
        <q-checkbox v-model="i.selected"></q-checkbox>
      </q-item-section>
      <q-item-section class="col-9">
        <q-item-label v-if="i.text" @click="openUpdateChecklistItemPrompt(i)">{{ i.text }}</q-item-label>
        <q-item-label v-else="i.text" @click="openUpdateChecklistItemPrompt(i)"><i>No item text</i></q-item-label>
      </q-item-section>
    </q-item>
  </q-list>

    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">New checklist item</div>
        </q-card-section>
        <q-card-section>
          <q-input placeholder="Enter item text" dense v-model="tempItemText" autofocus @keyup.enter="_addNewChecklistItem()" />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn @click="_addNewChecklistItem()" flat label="Add" v-close-popup />
          <q-btn flat label="Cancel" v-close-popup @click="closePrompt()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="updateItemPrompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Update checklist item</div>
        </q-card-section>
        <q-card-section>
          <q-input placeholder="Enter item text" dense v-model="tempItemText" autofocus @keyup.enter="_updateChecklistItem()" />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn @click="_updateChecklistItem()" flat label="Update" v-close-popup />
          <q-btn flat label="Cancel" v-close-popup @click="closePrompt()" />
        </q-card-actions>
      </q-card>
    </q-dialog>


    <q-footer class="flex flex-center">
      <q-btn-group style="width: 100%">
        <q-btn @click="prompt = true" :disable="disableChecklistItemButtons" class="col-6" color="primary" glossy label="Create" />
        <q-btn @click="_removeSelectedChecklistItems()" :disable="disableChecklistItemButtons" class="col-6" color="secondary" glossy label="Remove" />
      </q-btn-group>
    </q-footer>
  </q-page>
</template>

<script>
const crypto = require("crypto");


export default {
  name: 'PageIndex',
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
    activeChecklistItems() {
      return this.$store.getters.getActiveChecklist.items;
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
  },
  methods: {
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
