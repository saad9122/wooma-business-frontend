export const API_TAGS = {
  // Property-related tags used by the simplified API
  PROPERTY: "Property",
  PROPERTY_LIST: "PropertyList",
} as const;

// Tag ID generators for dynamic tags used by the simplified API
export const TagIds = {
  // Property tag IDs
  property: (id: string) => ({ type: API_TAGS.PROPERTY, id }),
  propertyList: () => ({ type: API_TAGS.PROPERTY_LIST, id: "LIST" }),
};

// Helper function to create multiple tags
export const createTags = {
  // Create tags for a list with individual items
  forList: <T extends { id: string }>(
    data: T[] | undefined,
    listTag: ReturnType<typeof TagIds.propertyList>,
    itemTagFn: (id: string) => ReturnType<typeof TagIds.property>
  ) => {
    return data ? [listTag, ...data.map(({ id }) => itemTagFn(id))] : [listTag];
  },
};

// Type definitions for tag types
export type ApiTagType = (typeof API_TAGS)[keyof typeof API_TAGS];
export type TagId = ReturnType<(typeof TagIds)[keyof typeof TagIds]>;
