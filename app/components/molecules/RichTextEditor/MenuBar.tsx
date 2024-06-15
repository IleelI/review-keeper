import { Editor } from "@tiptap/react";
import { twJoin } from "tailwind-merge";

import { BoldIcon } from "~/assets/icons/Bold.icon";
import { CodeIcon } from "~/assets/icons/Code.icon";
import { CodeBracketsIcon } from "~/assets/icons/CodeBrackets.icon";
import { ItalicIcon } from "~/assets/icons/Italic.icon";
import { ListIcon } from "~/assets/icons/List.icon";
import { Number1SquareIcon } from "~/assets/icons/Number1Square.icon";
import { Number2SquareIcon } from "~/assets/icons/Number2Square.icon";
import { Number3SquareIcon } from "~/assets/icons/Number3Square.icon";
import { Number4SquareIcon } from "~/assets/icons/Number4Square.icon";
import { Number5SquareIcon } from "~/assets/icons/Number5Square.icon";
import { Number6SquareIcon } from "~/assets/icons/Number6Square.icon";
import { NumberListIcon } from "~/assets/icons/NumberedList.icon";
import { QuoteIcon } from "~/assets/icons/Quote.icon";
import { RedoIcon } from "~/assets/icons/Redo.icon";
import { StrikethroughIcon } from "~/assets/icons/Strikethrough.icon";
import { TextIcon } from "~/assets/icons/Text.icon";
import { UndoIcon } from "~/assets/icons/Undo.icon";
import { XMarkCircleIcon } from "~/assets/icons/X Mark Circle.icon";

import MenuBarButton from "./MenuBarButton";

interface MenuBarProps {
  editor: Editor;
}
const MenuBar = ({ editor }: MenuBarProps) => {
  return (
    <div className="flex flex-wrap gap-6 border-b border-neutral-300 bg-neutral-50 p-2 dark:border-neutral-700 dark:bg-neutral-800">
      <section className="flex flex-wrap items-center gap-1.5 overflow-hidden">
        <MenuBarButton
          handleClick={() => editor.chain().focus().toggleBold().run()}
          icon={<BoldIcon />}
          isActive={editor.isActive("bold")}
          isDisabled={!editor.can().chain().focus().toggleBold().run()}
        />
        <MenuBarButton
          handleClick={() => editor.chain().focus().toggleItalic().run()}
          icon={<ItalicIcon />}
          isActive={editor.isActive("italic")}
          isDisabled={!editor.can().chain().focus().toggleItalic().run()}
        />
        <MenuBarButton
          handleClick={() => editor.chain().focus().toggleStrike().run()}
          icon={<StrikethroughIcon />}
          isActive={editor.isActive("strike")}
          isDisabled={!editor.can().chain().focus().toggleStrike().run()}
        />
        <MenuBarButton
          handleClick={() => editor.chain().focus().toggleCode().run()}
          icon={<CodeBracketsIcon />}
          isActive={editor.isActive("code")}
          isDisabled={!editor.can().chain().focus().toggleCode().run()}
        />
      </section>

      <section className="flex flex-wrap items-center gap-1.5 overflow-hidden">
        <MenuBarButton
          handleClick={() => editor.chain().focus().setParagraph().run()}
          icon={<TextIcon />}
          isActive={editor.isActive("paragraph")}
        />
        <MenuBarButton
          handleClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          icon={<Number1SquareIcon />}
          isActive={editor.isActive("heading", { level: 1 })}
        />
        <MenuBarButton
          handleClick={() =>
            editor.chain().focus().setHeading({ level: 2 }).run()
          }
          icon={<Number2SquareIcon />}
          isActive={editor.isActive("heading", { level: 2 })}
        />
        <MenuBarButton
          handleClick={() =>
            editor.chain().focus().setHeading({ level: 3 }).run()
          }
          icon={<Number3SquareIcon />}
          isActive={editor.isActive("heading", { level: 3 })}
        />
        <MenuBarButton
          handleClick={() =>
            editor.chain().focus().setHeading({ level: 4 }).run()
          }
          icon={<Number4SquareIcon />}
          isActive={editor.isActive("heading", { level: 4 })}
        />
        <MenuBarButton
          handleClick={() =>
            editor.chain().focus().setHeading({ level: 5 }).run()
          }
          icon={<Number5SquareIcon />}
          isActive={editor.isActive("heading", { level: 5 })}
        />
        <MenuBarButton
          handleClick={() =>
            editor.chain().focus().setHeading({ level: 6 }).run()
          }
          icon={<Number6SquareIcon />}
          isActive={editor.isActive("heading", { level: 6 })}
        />
      </section>

      <section className="flex flex-wrap items-center gap-1.5 overflow-hidden">
        <MenuBarButton
          handleClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={<ListIcon />}
          isActive={editor.isActive("bulletList")}
        />
        <MenuBarButton
          handleClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={<NumberListIcon />}
          isActive={editor.isActive("orderedList")}
        />
        <MenuBarButton
          handleClick={() => editor.chain().focus().toggleCodeBlock().run()}
          icon={<CodeIcon />}
          isActive={editor.isActive("codeBlock")}
        />
        <MenuBarButton
          handleClick={() => editor.chain().focus().toggleBlockquote().run()}
          icon={<QuoteIcon />}
          isActive={editor.isActive("blockquote")}
        />
      </section>

      <section className="flex flex-wrap items-center gap-1.5 overflow-hidden">
        <MenuBarButton
          handleClick={() => editor.chain().focus().undo().run()}
          icon={<UndoIcon />}
          isDisabled={!editor.can().chain().focus().undo().run()}
        />
        <MenuBarButton
          handleClick={() => editor.chain().focus().redo().run()}
          icon={<RedoIcon />}
          isDisabled={!editor.can().chain().focus().redo().run()}
        />
      </section>

      <section className="flex items-center gap-2">
        <input
          className={twJoin([
            "aspect-square h-9 w-9 items-center overflow-hidden rounded-md bg-transparent p-2 transition-colors  ease-in-out focus:outline-none enabled:hover:bg-neutral-200 enabled:focus-visible:bg-neutral-200 dark:border-neutral-700 dark:enabled:hover:bg-neutral-700 dark:enabled:focus-visible:bg-neutral-700",
            editor.isActive("textStyle")
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 enabled:hover:text-primary-600 enabled:focus-visible:text-primary-600 dark:text-neutral-400 dark:enabled:hover:text-primary-400 dark:enabled:focus-visible:text-primary-400",
          ])}
          onInput={(event) =>
            editor
              .chain()
              .focus()
              .setColor((event.target as HTMLInputElement).value)
              .run()
          }
          value={editor.getAttributes("textStyle").color ?? "#4f46e5"}
          type="color"
        />
        <MenuBarButton
          handleClick={() =>
            editor
              .chain()
              .focus()
              .updateAttributes("textStyle", { color: "" })
              .run()
          }
          icon={<XMarkCircleIcon />}
          isDisabled={!editor.getAttributes("textStyle").color}
        />
      </section>
    </div>
  );
};

export default MenuBar;
