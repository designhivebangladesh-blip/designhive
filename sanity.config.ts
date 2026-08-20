import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import {
  cloudinaryAssetSourcePlugin,
  cloudinarySchemaPlugin,
} from "sanity-plugin-cloudinary";

import { projectId, dataset, apiVersion } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure, SINGLETON_TYPES, STUDIO_CONTENT_TYPES } from "./sanity/structure";

export default defineConfig({
  name: "designhive",
  title: "Designhive Studio",

  // Must match the route the Studio is mounted at (app/studio/[[...tool]]).
  basePath: "/studio",

  projectId,
  dataset,

  schema: {
    types: schemaTypes,
  },

  document: {
    // Singletons can't be deleted, unpublished, or duplicated into a
    // second copy — the desk structure already only exposes one editable
    // instance of each, this is the server-side backstop.
    actions: (input, context) => {
      const actions = SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(
            ({ action }) =>
              action && !["unpublish", "delete", "duplicate"].includes(action)
          )
        : input;

      // Non-editorial document types are registered read-only so references
      // can still resolve, but all mutation actions are removed from Studio.
      if (!STUDIO_CONTENT_TYPES.has(context.schemaType)) {
        return actions.filter(
          ({ action }) =>
            action && !["unpublish", "delete", "duplicate", "publish"].includes(action)
        );
      }

      return actions;
    },
    // Only editorial content types can be created from Studio. Business and
    // site-settings documents are read-only in this Studio and are managed
    // through the authenticated /admin UI.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter(
            (item) =>
              STUDIO_CONTENT_TYPES.has(item.templateId) &&
              !SINGLETON_TYPES.has(item.templateId)
          )
        : prev,
  },

  plugins: [
    structureTool({ structure }),
    // Registers the `cloudinary.asset` schema object used by any field
    // that should store media as a Cloudinary reference.
    cloudinarySchemaPlugin(),
    // Adds Cloudinary's Media Library as an image asset source inside
    // Studio's normal image fields. Takes no config here — on first use,
    // Studio prompts for your Cloud Name + API Key and stores them as a
    // private document in this dataset. The widget itself then requires
    // logging into your actual Cloudinary account before anyone can
    // browse, select, or upload media — that login is the real access
    // boundary, not anything configured in this file.
    cloudinaryAssetSourcePlugin(),
  ],
});
