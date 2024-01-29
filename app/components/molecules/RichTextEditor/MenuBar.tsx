import {
  TextBolder,
  TextItalic,
  TextStrikethrough,
  Code,
  Paragraph,
  TextHOne,
  TextHTwo,
  TextHThree,
  TextHFour,
  TextHFive,
  TextHSix,
  ListBullets,
  ListNumbers,
  CodeBlock,
  Quotes,
  ArrowUDownLeft,
  ArrowUUpRight,
  IconContext,
} from "@phosphor-icons/react";
import { Editor } from "@tiptap/react";
import clsx from "clsx";

import MenuBarButton from "./MenuBarButton";

interface MenuBarProps {
  editor: Editor;
}
const MenuBar = ({ editor }: MenuBarProps) => {
  return (
    <IconContext.Provider value={{ size: 20 }}>
      <div className="flex flex-wrap border-b border-neutral-300 dark:border-neutral-700">
        <section className="flex flex-wrap items-center gap-1 overflow-hidden px-2 py-1">
          <MenuBarButton
            handleClick={() => editor.chain().focus().toggleBold().run()}
            icon={<TextBolder />}
            isActive={editor.isActive("bold")}
            isDisabled={!editor.can().chain().focus().toggleBold().run()}
          />
          <MenuBarButton
            handleClick={() => editor.chain().focus().toggleItalic().run()}
            icon={<TextItalic />}
            isActive={editor.isActive("italic")}
            isDisabled={!editor.can().chain().focus().toggleItalic().run()}
          />
          <MenuBarButton
            handleClick={() => editor.chain().focus().toggleStrike().run()}
            icon={<TextStrikethrough />}
            isActive={editor.isActive("strike")}
            isDisabled={!editor.can().chain().focus().toggleStrike().run()}
          />
          <MenuBarButton
            handleClick={() => editor.chain().focus().toggleCode().run()}
            icon={<Code />}
            isActive={editor.isActive("code")}
            isDisabled={!editor.can().chain().focus().toggleCode().run()}
          />
        </section>

        <section className="flex flex-wrap items-center gap-1 overflow-hidden px-2 py-1">
          <MenuBarButton
            handleClick={() => editor.chain().focus().setParagraph().run()}
            icon={<Paragraph />}
            isActive={editor.isActive("paragraph")}
          />
          <MenuBarButton
            handleClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            icon={<TextHOne />}
            isActive={editor.isActive("heading", { level: 1 })}
          />
          <MenuBarButton
            handleClick={() =>
              editor.chain().focus().setHeading({ level: 2 }).run()
            }
            icon={<TextHTwo />}
            isActive={editor.isActive("heading", { level: 2 })}
          />
          <MenuBarButton
            handleClick={() =>
              editor.chain().focus().setHeading({ level: 3 }).run()
            }
            icon={<TextHThree />}
            isActive={editor.isActive("heading", { level: 3 })}
          />
          <MenuBarButton
            handleClick={() =>
              editor.chain().focus().setHeading({ level: 4 }).run()
            }
            icon={<TextHFour />}
            isActive={editor.isActive("heading", { level: 4 })}
          />
          <MenuBarButton
            handleClick={() =>
              editor.chain().focus().setHeading({ level: 5 }).run()
            }
            icon={<TextHFive />}
            isActive={editor.isActive("heading", { level: 5 })}
          />
          <MenuBarButton
            handleClick={() =>
              editor.chain().focus().setHeading({ level: 6 }).run()
            }
            icon={<TextHSix />}
            isActive={editor.isActive("heading", { level: 6 })}
          />
        </section>

        <section className="flex flex-wrap items-center gap-1 overflow-hidden px-2 py-1">
          <MenuBarButton
            handleClick={() => editor.chain().focus().toggleBulletList().run()}
            icon={<ListBullets />}
            isActive={editor.isActive("bulletList")}
          />
          <MenuBarButton
            handleClick={() => editor.chain().focus().toggleOrderedList().run()}
            icon={<ListNumbers />}
            isActive={editor.isActive("orderedList")}
          />
          <MenuBarButton
            handleClick={() => editor.chain().focus().toggleCodeBlock().run()}
            icon={<CodeBlock />}
            isActive={editor.isActive("codeBlock")}
          />
          <MenuBarButton
            handleClick={() => editor.chain().focus().toggleBlockquote().run()}
            icon={<Quotes />}
            isActive={editor.isActive("blockquote")}
          />
        </section>

        <section className="flex flex-wrap items-center gap-1 overflow-hidden px-2 py-1">
          <MenuBarButton
            handleClick={() => editor.chain().focus().undo().run()}
            icon={<ArrowUDownLeft />}
            isDisabled={!editor.can().chain().focus().undo().run()}
          />
          <MenuBarButton
            handleClick={() => editor.chain().focus().redo().run()}
            icon={<ArrowUUpRight />}
            isDisabled={!editor.can().chain().focus().redo().run()}
          />
        </section>

        <section className="flex items-center p-2">
          <input
            className={clsx([
              "aspect-square h-9 w-9 items-center overflow-hidden rounded-md bg-transparent p-2 transition-colors duration-300 ease-in-out focus:outline-none enabled:hover:bg-neutral-200 enabled:focus-visible:bg-neutral-200 dark:border-neutral-700 dark:enabled:hover:bg-neutral-700 dark:enabled:focus-visible:bg-neutral-700",
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
        </section>
      </div>
    </IconContext.Provider>
  );
};

export default MenuBar;
