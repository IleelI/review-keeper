/* eslint-disable import/no-named-as-default */
import {
  ArrowUDownLeft,
  ArrowUUpRight,
  Code,
  CodeBlock,
  ListBullets,
  ListNumbers,
  Paragraph,
  Quotes,
  TextBolder,
  TextHFive,
  TextHFour,
  TextHOne,
  TextHSix,
  TextHThree,
  TextHTwo,
  TextItalic,
  TextStrikethrough,
} from "@phosphor-icons/react";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import clsx from "clsx";

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle,
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
];

const content = `
  <h1>Lorem Ipsum Master: A Seamless Text Filler Experience</h1>
  <p class="rating">Rating: ⭐⭐⭐⭐☆ (4/5)</p>
  <p>Lorem Ipsum Master simplifies placeholder text generation with its clean and intuitive interface, catering to designers and developers. The real-time preview and customizable options make it an essential tool for web and graphic design projects.</p>
  <p>Featuring clipboard integration for swift copying and pasting, this application enhances productivity. While excelling in core functionality, additional features could further elevate its appeal.</p>
`;

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap border-b border-neutral-300 dark:border-neutral-700">
      <section className="flex flex-wrap items-center gap-1 overflow-hidden px-2 py-1">
        <button
          className={clsx([
            "aspect-square items-center rounded-md p-2 transition-colors duration-300 ease-in-out focus:outline-none enabled:hover:bg-neutral-200 enabled:focus-visible:bg-neutral-200 disabled:opacity-40 dark:border-neutral-700 dark:enabled:hover:bg-neutral-700 dark:enabled:focus-visible:bg-neutral-700",
            editor.isActive("bold")
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 enabled:hover:text-primary-600 enabled:focus-visible:text-primary-600 dark:text-neutral-400 dark:enabled:hover:text-primary-400 dark:enabled:focus-visible:text-primary-400",
          ])}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <TextBolder size={20} weight="bold" />
        </button>
        <button
          className={clsx([
            "aspect-square items-center rounded-md p-2 transition-colors duration-300 ease-in-out focus:outline-none enabled:hover:bg-neutral-200 enabled:focus-visible:bg-neutral-200 disabled:opacity-40 dark:border-neutral-700 dark:enabled:hover:bg-neutral-700 dark:enabled:focus-visible:bg-neutral-700",
            editor.isActive("italic")
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 enabled:hover:text-primary-600 enabled:focus-visible:text-primary-600 dark:text-neutral-400 dark:enabled:hover:text-primary-400 dark:enabled:focus-visible:text-primary-400",
          ])}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <TextItalic size={20} weight="bold" />
        </button>
        <button
          className={clsx([
            "aspect-square items-center rounded-md p-2 transition-colors duration-300 ease-in-out focus:outline-none enabled:hover:bg-neutral-200 enabled:focus-visible:bg-neutral-200 disabled:opacity-40 dark:border-neutral-700 dark:enabled:hover:bg-neutral-700 dark:enabled:focus-visible:bg-neutral-700",
            editor.isActive("strike")
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 enabled:hover:text-primary-600 enabled:focus-visible:text-primary-600 dark:text-neutral-400 dark:enabled:hover:text-primary-400 dark:enabled:focus-visible:text-primary-400",
          ])}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <TextStrikethrough size={20} weight="bold" />
        </button>
        <button
          className={clsx([
            "aspect-square items-center rounded-md p-2 transition-colors duration-300 ease-in-out focus:outline-none enabled:hover:bg-neutral-200 enabled:focus-visible:bg-neutral-200 disabled:opacity-40 dark:border-neutral-700 dark:enabled:hover:bg-neutral-700 dark:enabled:focus-visible:bg-neutral-700",
            editor.isActive("code")
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 enabled:hover:text-primary-600 enabled:focus-visible:text-primary-600 dark:text-neutral-400 dark:enabled:hover:text-primary-400 dark:enabled:focus-visible:text-primary-400",
          ])}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code size={20} weight="bold" />
        </button>
      </section>

      <section className="flex flex-wrap items-center gap-1 overflow-hidden px-2 py-1">
        <button
          className={clsx([
            "aspect-square items-center rounded-md p-2 transition-colors duration-300 ease-in-out focus:outline-none enabled:hover:bg-neutral-200 enabled:focus-visible:bg-neutral-200 disabled:opacity-40 dark:border-neutral-700 dark:enabled:hover:bg-neutral-700 dark:enabled:focus-visible:bg-neutral-700",
            editor.isActive("paragraph")
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 enabled:hover:text-primary-600 enabled:focus-visible:text-primary-600 dark:text-neutral-400 dark:enabled:hover:text-primary-400 dark:enabled:focus-visible:text-primary-400",
          ])}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <Paragraph size={20} weight="bold" />
        </button>
        <button
          className={clsx([
            "aspect-square items-center rounded-md p-2 transition-colors duration-300 ease-in-out focus:outline-none enabled:hover:bg-neutral-200 enabled:focus-visible:bg-neutral-200 disabled:opacity-40 dark:border-neutral-700 dark:enabled:hover:bg-neutral-700 dark:enabled:focus-visible:bg-neutral-700",
            editor.isActive("heading", { level: 1 })
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 enabled:hover:text-primary-600 enabled:focus-visible:text-primary-600 dark:text-neutral-400 dark:enabled:hover:text-primary-400 dark:enabled:focus-visible:text-primary-400",
          ])}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <TextHOne size={20} weight="bold" />
        </button>
        <button
          className={clsx([
            "aspect-square items-center rounded-md p-2 transition-colors duration-300 ease-in-out focus:outline-none enabled:hover:bg-neutral-200 enabled:focus-visible:bg-neutral-200 disabled:opacity-40 dark:border-neutral-700 dark:enabled:hover:bg-neutral-700 dark:enabled:focus-visible:bg-neutral-700",
            editor.isActive("heading", { level: 2 })
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 enabled:hover:text-primary-600 enabled:focus-visible:text-primary-600 dark:text-neutral-400 dark:enabled:hover:text-primary-400 dark:enabled:focus-visible:text-primary-400",
          ])}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <TextHTwo size={20} weight="bold" />
        </button>
        <button
          className={clsx([
            "aspect-square items-center rounded-md p-2 transition-colors duration-300 ease-in-out focus:outline-none enabled:hover:bg-neutral-200 enabled:focus-visible:bg-neutral-200 disabled:opacity-40 dark:border-neutral-700 dark:enabled:hover:bg-neutral-700 dark:enabled:focus-visible:bg-neutral-700",
            editor.isActive("heading", { level: 3 })
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 enabled:hover:text-primary-600 enabled:focus-visible:text-primary-600 dark:text-neutral-400 dark:enabled:hover:text-primary-400 dark:enabled:focus-visible:text-primary-400",
          ])}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <TextHThree size={20} weight="bold" />
        </button>
        <button
          className={clsx([
            "aspect-square items-center rounded-md p-2 transition-colors duration-300 ease-in-out focus:outline-none enabled:hover:bg-neutral-200 enabled:focus-visible:bg-neutral-200 disabled:opacity-40 dark:border-neutral-700 dark:enabled:hover:bg-neutral-700 dark:enabled:focus-visible:bg-neutral-700",
            editor.isActive("heading", { level: 4 })
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 enabled:hover:text-primary-600 enabled:focus-visible:text-primary-600 dark:text-neutral-400 dark:enabled:hover:text-primary-400 dark:enabled:focus-visible:text-primary-400",
          ])}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
        >
          <TextHFour size={20} weight="bold" />
        </button>
        <button
          className={clsx([
            "aspect-square items-center rounded-md p-2 transition-colors duration-300 ease-in-out focus:outline-none enabled:hover:bg-neutral-200 enabled:focus-visible:bg-neutral-200 disabled:opacity-40 dark:border-neutral-700 dark:enabled:hover:bg-neutral-700 dark:enabled:focus-visible:bg-neutral-700",
            editor.isActive("heading", { level: 5 })
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 enabled:hover:text-primary-600 enabled:focus-visible:text-primary-600 dark:text-neutral-400 dark:enabled:hover:text-primary-400 dark:enabled:focus-visible:text-primary-400",
          ])}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
        >
          <TextHFive size={20} weight="bold" />
        </button>
        <button
          className={clsx([
            "aspect-square items-center rounded-md p-2 transition-colors duration-300 ease-in-out focus:outline-none enabled:hover:bg-neutral-200 enabled:focus-visible:bg-neutral-200 disabled:opacity-40 dark:border-neutral-700 dark:enabled:hover:bg-neutral-700 dark:enabled:focus-visible:bg-neutral-700",
            editor.isActive("heading", { level: 6 })
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 enabled:hover:text-primary-600 enabled:focus-visible:text-primary-600 dark:text-neutral-400 dark:enabled:hover:text-primary-400 dark:enabled:focus-visible:text-primary-400",
          ])}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
        >
          <TextHSix size={20} weight="bold" />
        </button>
      </section>

      <section className="flex flex-wrap items-center gap-1 overflow-hidden px-2 py-1">
        <button
          className={clsx([
            "aspect-square items-center rounded-md p-2 transition-colors duration-300 ease-in-out focus:outline-none enabled:hover:bg-neutral-200 enabled:focus-visible:bg-neutral-200 disabled:opacity-40 dark:border-neutral-700 dark:enabled:hover:bg-neutral-700 dark:enabled:focus-visible:bg-neutral-700",
            editor.isActive("bulletList")
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 enabled:hover:text-primary-600 enabled:focus-visible:text-primary-600 dark:text-neutral-400 dark:enabled:hover:text-primary-400 dark:enabled:focus-visible:text-primary-400",
          ])}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <ListBullets size={20} weight="bold" />
        </button>
        <button
          className={clsx([
            "aspect-square items-center rounded-md p-2 transition-colors duration-300 ease-in-out focus:outline-none enabled:hover:bg-neutral-200 enabled:focus-visible:bg-neutral-200 disabled:opacity-40 dark:border-neutral-700 dark:enabled:hover:bg-neutral-700 dark:enabled:focus-visible:bg-neutral-700",
            editor.isActive("orderedList")
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 enabled:hover:text-primary-600 enabled:focus-visible:text-primary-600 dark:text-neutral-400 dark:enabled:hover:text-primary-400 dark:enabled:focus-visible:text-primary-400",
          ])}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListNumbers size={20} weight="bold" />
        </button>
        <button
          className={clsx([
            "aspect-square items-center rounded-md p-2 transition-colors duration-300 ease-in-out focus:outline-none enabled:hover:bg-neutral-200 enabled:focus-visible:bg-neutral-200 disabled:opacity-40 dark:border-neutral-700 dark:enabled:hover:bg-neutral-700 dark:enabled:focus-visible:bg-neutral-700",
            editor.isActive("codeBlock")
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 enabled:hover:text-primary-600 enabled:focus-visible:text-primary-600 dark:text-neutral-400 dark:enabled:hover:text-primary-400 dark:enabled:focus-visible:text-primary-400",
          ])}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <CodeBlock size={20} weight="bold" />
        </button>
        <button
          className={clsx([
            "aspect-square items-center rounded-md p-2 transition-colors duration-300 ease-in-out focus:outline-none enabled:hover:bg-neutral-200 enabled:focus-visible:bg-neutral-200 disabled:opacity-40 dark:border-neutral-700 dark:enabled:hover:bg-neutral-700 dark:enabled:focus-visible:bg-neutral-700",
            editor.isActive("blockquote")
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 enabled:hover:text-primary-600 enabled:focus-visible:text-primary-600 dark:text-neutral-400 dark:enabled:hover:text-primary-400 dark:enabled:focus-visible:text-primary-400",
          ])}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quotes size={20} weight="bold" />
        </button>
      </section>

      <section className="flex flex-wrap items-center gap-1 overflow-hidden px-2 py-1">
        <button
          className="aspect-square rounded-md p-2 text-neutral-600 transition-colors ease-in-out hover:text-black disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-white"
          disabled={!editor.can().chain().focus().undo().run()}
          onClick={() => editor.chain().focus().undo().run()}
          type="button"
        >
          <ArrowUDownLeft size={20} weight="bold" />
        </button>
        <button
          className="aspect-square h-9 w-9 rounded-md p-2 text-neutral-600 transition-colors ease-in-out hover:text-black disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-white"
          disabled={!editor.can().chain().focus().redo().run()}
          onClick={() => editor.chain().focus().redo().run()}
          type="button"
        >
          <ArrowUUpRight size={20} weight="bold" />
        </button>
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
  );
};

export default function Review() {
  const editor = useEditor({
    extensions,
    content,
    injectCSS: false,
  });

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
      <MenuBar editor={editor} />
      <EditorContent className="p-4 [&_*]:outline-none" editor={editor} />
    </div>
  );
}
