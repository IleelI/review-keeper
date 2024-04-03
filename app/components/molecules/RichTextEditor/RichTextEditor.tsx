import ColorExtension from "@tiptap/extension-color";
import ListItemExtension, { ListItem } from "@tiptap/extension-list-item";
import TextStyleExtension, {
  TextStyleOptions,
} from "@tiptap/extension-text-style";
import { Editor, EditorContent, type Extensions } from "@tiptap/react";
import StarterKitExtension from "@tiptap/starter-kit";
import { twMerge } from "tailwind-merge";

import MenuBar from "./MenuBar";

export const extensions: Extensions = [
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
        "flex flex-col overflow-hidden rounded-md border border-neutral-300 bg-white transition  dark:border-neutral-700 dark:bg-neutral-800 ",
        hasError && "border-red-700 dark:border-red-300",
      )}
    >
      <MenuBar editor={editor} />
      <EditorContent
        className="grid max-h-[400px] min-h-[200px] overflow-y-auto p-4 [&_.tiptap]:outline-none"
        editor={editor}
      />
    </div>
  );
};

export default RichTextEditor;

export const RichTextEditorSkeleton = () => (
  <div className="col-span-2 h-[250px] animate-pulse rounded-md border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800"></div>
);
