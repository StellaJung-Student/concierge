<template>
  <div>
    <h3 v-show="!hasMonitors">No applications have been deployed during your session</h3>

    <div class="container" v-if="hasMonitors">
      <div class="columns">
        <div class="col-12">
          <div class="form">
            <div class="form-group">
              <label class="form-label">Application Deployments</label>
              <select class="form-select" v-model="selected">
                <option v-for="(m, i) in monitors" :key="i" v-bind:value="m">{{m.id}}</option>
              </select>
            </div>
          </div>
        </div>

        <div classs="col-1"></div>
        <div class="col-10" v-for="(entry, i) in entries" :key="i">
          <pre style="white-space: pre-wrap; margin: 5px">{{entry}}</pre>
        </div>
        <div class="col-1"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Monitor } from './api'

export default Vue.extend({
  props: {
    monitors: { type: Array as () => Monitor[] }
  },
  data() {
    return {
      selected: { id: '' } as Monitor
    }
  },
  watch: {
    monitors: function(monitors: Monitor[]) {
      if (!monitors || monitors.length === 0) {
        return
      }

      if (this.selected.id) {
        return
      }

      this.selected = monitors[0]
    }
  },
  computed: {
    hasMonitors: function() {
      return Array.isArray(this.monitors)
    },
    entries: function(): string[] {
      const monitor = this.monitors.find(mon => mon.id === this.selected.id)
      if (monitor) {
        const logs = monitor.logs.filter(log => !!log)
        return logs
      }

      return []
    }
  }
})
</script>
