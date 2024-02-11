import ColorExtension from "@tiptap/extension-color";
import ListItemExtension, { ListItem } from "@tiptap/extension-list-item";
import TextStyleExtension, {
  TextStyleOptions,
} from "@tiptap/extension-text-style";
import { Editor, EditorContent } from "@tiptap/react";
import StarterKitExtension from "@tiptap/starter-kit";
import { twMerge } from "tailwind-merge";

import MenuBar from "./MenuBar";

export const extensions = [
  ColorExtension.configure({
    types: [TextStyleExtension.name, ListItemExtension.name],
  }),
  TextStyleExtension.configure({
    types: [ListItem.name],
  } as Partial<TextStyleOptions>),
  StarterKitExtension,
];

interface RichTextEditorProps {
  editor: Editor | null;
  hasError?: boolean;
}

const RichTextEditor = ({ editor, hasError }: RichTextEditorProps) => {
  if (!editor) return null;

  return (
    <div
      className={twMerge(
        "flex flex-col overflow-hidden rounded-lg border border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800",
        hasError && "border-red-700 dark:border-red-300",
      )}
    >
      <MenuBar editor={editor} />
      <EditorContent
        className="grid max-h-[400px] min-h-[200px] overflow-y-auto px-4 [&_.tiptap]:outline-none"
        editor={editor}
      />
    </div>
  );
};

export default RichTextEditor;
