export type YChange = {
  user: string,
  state: string,
  type: 'removed' | 'added' | null;
  color: {
    dark: string;
    light: string;
  };
  // Add other properties if needed based on the actual structure of ychange
};

// this isn't great but gets us by in a few wierd places
export interface AllAttrs {
  [key: string]: string | null; // Attribute values are strings or null
}