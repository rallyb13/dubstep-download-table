import Ember from 'ember';
import { DOWNLOAD_DATA } from '../utils/download-data';
import { computed } from '@ember/object';

export default Ember.Component.extend({
  formattedData: computed(function() {
    return DOWNLOAD_DATA.map(item => {
      return { ...item, isSelected: false, status: item.status.capitalize() };
    });
  }),

  selectedItems: computed('formattedData', function() {
    return this.formattedData.filter(item => {
      return item.isSelected === true;
    });
  }),

  selectedCount: computed('selectedItems.length', function() {
    return this.selectedItems.length;
  }),

  hasSelectedItems: computed('selectedCount', function() {
    return this.selectedCount > 0;
  }),

  isIndeterminate: computed('selectedCount', 'formattedData.length', function() {
    return this.selectedCount > 0 && this.selectedCount < this.formattedData.length;
  }),

  isAllChecked: computed('selectedCount', 'formattedData.length', function() {
    return this.selectedCount === this.formattedData.length;
  }),

  actions: {
    downloadSelected() {
      const selected = this.selectedItems;
      const available = selected.filter(item => item.status === 'Available');
      const didFilterOut = available.length < selected.length;
      let text;

      if (available.length) {
        const info = available.map(item => `${item.device}: ${item.path} \n`).join(" ");
        text = `Downloading: \n \n ${info} ${didFilterOut ? "Some of your selected downloads are not yet available." : "" }`;
      } else {
        text = 'None of your selected downloads are available.';
      }
      window.alert(text);
    },

    handleSelectAll() {
      const shouldSelect = !this.isAllChecked;
      const updatedData = this.formattedData.map(record => {
        return { ...record, isSelected: shouldSelect };
      });
      this.set('formattedData', updatedData);
    },

    handleSelection(item) {
      const updatedData = this.formattedData.map(record => {
        if (record.name === item.name) {
          return { ...record, isSelected: !record.isSelected };
        }
        return record;
      });
      this.set('formattedData', updatedData);
    },
  },
});
