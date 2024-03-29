<template>
<q-layout view="lHh Lpr lFf">
  <q-header elevated>
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        @click="leftDrawerOpen = !leftDrawerOpen"
        icon="menu_open"
        aria-label="open checklist overview"
        />

      <q-toolbar-title>
        Turbo Notes
      </q-toolbar-title>
      <label @class="checklist-title-text" v-if="this.activeChecklist.name">{{ this.activeChecklist.name }}</label>
      <!-- In the event there is no active checklist, do not display the 'No checklist name' text. -->
      <i v-else>{{ !this.activeChecklist.id ? '' : 'No checklist name' }}</i>
    </q-toolbar>
  </q-header>

  <q-drawer
    v-model="leftDrawerOpen"
    show-if-above
    bordered
    content-class="bg-grey-2"
    >
    <q-list>
      <div class="checklist-overview-header">
        <!-- EDIT HERE -->
        <q-toolbar>
          <q-btn
            flat
            dense
            round
            @click="leftDrawerOpen = !leftDrawerOpen"
            icon="close"
            aria-label="close checklist overview"
            />
          <q-item-label header>Checklists</q-item-label>
          </q-toolbar>
      </div>

      <draggable v-model="checklists" @start="drag=true" @end="drag=false" handle=".handle">
        <q-item name="checklist overview item" clickable tag="a" v-for="(i, k) in checklists" :key="k" :style="checklistSelectorStyle(i.active)">
          <q-item-section name="set active checklist" avatar @click="_setActiveCheckList(i.id)">
            <q-icon name="open_in_new" />
          </q-item-section>

          <q-item-section @click="openUpdateChecklistPrompt(i)">
            <q-item-label name="checklist name" class="checklist-name-in-drawer" v-if="i.name">{{ i.name }}</q-item-label>
            <q-item-label v-else><i>No checklist name</i></q-item-label>
            <q-item-label name="checklist description" class="checklist-desc-in-drawer" :style="i.desc ? '' : 'font-style: italic'" caption>{{ i.desc ? i.desc : 'No description' }}</q-item-label>
          </q-item-section>
          <q-checkbox role="checkbox" v-model="i.selected"></q-checkbox>
          <q-btn flat icon="menu" class="handle"></q-btn>
        </q-item>
      </draggable>

    </q-list>
    <q-item-label v-if="!checklists || checklists.length < 1" class="no-checklists-found-message">Click "Create" to start a new checklist</q-item-label>

      <q-dialog v-model="prompt" persistent>
        <q-card style="min-width: 350px">
          <!-- <q-card-section>
            <div class="text-h6">New checklist</div>
          </q-card-section> -->
          <q-card-section>
            <q-input maxlength="50" name="enter checklist name" placeholder="Enter checklist name" dense v-model="tempChecklistName" autofocus @keyup.enter="_addNewChecklist()" />
            <q-input name="enter checklist description" placeholder="Enter checklist description (optional)" dense v-model="tempChecklistDesc" @keyup.enter="_addNewChecklist()" />
          </q-card-section>
          <q-card-actions align="left" class="text-primary">
            <q-btn @click="_addNewChecklist()" flat label="Add" v-close-popup />
            <q-btn flat label="Cancel" v-close-popup @click="closePrompt()" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="updateChecklistPrompt" persistent>
        <q-card style="min-width: 350px">
          <!-- <q-card-section>
            <div class="text-h6">Update checklist</div>
          </q-card-section> -->
          <q-card-section>
            <q-input maxlength="50" name="update checklist name" placeholder="Update checklist name" dense v-model="tempChecklistName" autofocus @keyup.enter="_updateChecklist()" />
            <q-input name="update checklist description" placeholder="Update checklist description" dense v-model="tempChecklistDesc" @keyup.enter="_updateChecklist()" />
          </q-card-section>
          <q-card-actions align="left" class="text-primary">
            <q-btn @click="_updateChecklist()" flat label="Update" v-close-popup />
            <q-btn flat label="Cancel" v-close-popup @click="closePrompt()" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-footer class="flex flex-center">
        <q-btn-group style="width: 100%">
          <q-btn id="create-new-checklist" @click="prompt = true" class="col-6" color="primary" glossy icon="create_new_folder" label="Create" />
          <q-btn id="remove-checklist" @click="_removeSelectedChecklists()" class="col-6" color="secondary" glossy icon="remove_circle" label="Remove" />
        </q-btn-group>
      </q-footer>

    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
const crypto = require("crypto");
import draggable from 'vuedraggable';


export default {
  name: 'MyLayout',
  components: {
    draggable
  },
  data() {
    return {
      leftDrawerOpen       : false,
      tempChecklistName    : "",
      tempChecklistDesc    : "",
      prompt               : false,
      updateChecklistPrompt: false,
      updateChecklistObj   : {}
    }
  },
  computed: {
    checklists: {
      get() {
        return this.$store.getters.getAllCheckLists;
      },
      set(updatedChecklistsArray) {
        this.$store.commit("setChecklists", updatedChecklistsArray);
      }
    },
    activeChecklist() {
      return this.$store.getters.getActiveChecklist;
    }
  },
  mounted() {
    if (!this.checklists || this.checklists.length < 1) {
      this.leftDrawerOpen = true;
    }
  },
  methods: {
    generateId() {
      return crypto.randomBytes(16).toString("hex");
    },
    _setActiveCheckList(selectedChecklistId) {
      this.$store.commit("setActiveCheckList", selectedChecklistId);
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    checklistSelectorStyle(activeChecklist) {
      if (activeChecklist) {
        return {
          "background-color": "lightgrey"
        }
      }

    },
    _removeSelectedChecklists() {
      this.$store.commit("removeSelectedChecklists");
    },
    _addNewChecklist() {
      let checklistObj = {
        id      : this.generateId(),
        name    : this.tempChecklistName,
        desc    : this.tempChecklistDesc,
        active  : false,
        selected: false,
        items   : []
      };
      this.$store.commit("addNewChecklist", checklistObj);
      this.tempChecklistName = "";
      this.tempChecklistDesc = "";
      this.prompt = false;
    },
    openUpdateChecklistPrompt(checklistObj) {
      this.updateChecklistPrompt = true;
      this.updateChecklistObj    = checklistObj;
      this.tempChecklistName     = checklistObj.name;
      this.tempChecklistDesc     = checklistObj.desc;
    },
    _updateChecklist() {
      this.updateChecklistObj.name = this.tempChecklistName;
      this.updateChecklistObj.desc = this.tempChecklistDesc;
      this.$store.commit("updateChecklist", this.updateChecklistObj);
      this.updateChecklistObj = {};
      this.updateChecklistPrompt = false;
      this.tempChecklistName = "";
      this.tempChecklistDesc = "";
    },
    closePrompt() {
      this.tempChecklistName = "";
      this.tempChecklistDesc = "";
      /**
       * The prompt is toggled to "false" by the "v-close-popup" attribute
       * on the popup's "Cancel" button.
       */
    }
  }
}
</script>
