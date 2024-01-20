import ColorExtension from "@tiptap/extension-color";
import ListItemExtension, { ListItem } from "@tiptap/extension-list-item";
import TextStyleExtension, {
  TextStyleOptions,
} from "@tiptap/extension-text-style";
import { Editor, EditorContent } from "@tiptap/react";
import StarterKitExtension from "@tiptap/starter-kit";

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
}

const RichTextEditor = ({ editor }: RichTextEditorProps) => {
  if (!editor) return null;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
      <MenuBar editor={editor} />
      <EditorContent
        className="grid max-h-[400px] min-h-[200px] overflow-y-auto px-4 py-2 [&_.tiptap]:outline-none"
        editor={editor}
      />
    </div>
  );
};

export default RichTextEditor;
