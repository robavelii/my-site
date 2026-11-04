// Build-time helpers for the MDX pipeline in vite.config.ts.

/**
 * Turns a fence's meta string into attributes on the <pre>:
 *   ```ts title="apps/worker/src/sync-room.ts"
 * becomes <pre data-title="apps/worker/src/sync-room.ts" data-language="ts">.
 */
export function shikiCodeTitle() {
  return {
    name: 'code-title',
    pre(node) {
      const meta = this.options.meta?.__raw ?? '';
      const title = /title="([^"]+)"/.exec(meta)?.[1];
      if (title) node.properties['data-title'] = title;
      node.properties['data-language'] = this.options.lang;
    },
  };
}
