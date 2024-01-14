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
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`;

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <section className="flex gap-0.5 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-100 px-2 py-1 dark:bg-neutral-900">
        <button
          className={clsx([
            "aspect-square rounded-lg bg-neutral-100 p-2 transition-colors dark:bg-neutral-900",
            editor.isActive("bold")
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white",
          ])}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <TextBolder size={20} weight="bold" />
        </button>
        <button
          className={clsx([
            "aspect-square rounded-lg bg-neutral-100 p-2 transition-colors dark:bg-neutral-900",
            editor.isActive("italic")
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white",
          ])}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <TextItalic size={20} />
        </button>
        <button
          className={clsx([
            "aspect-square rounded-lg bg-neutral-100 p-2 transition-colors dark:bg-neutral-900",
            editor.isActive("strike")
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white",
          ])}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <TextStrikethrough size={20} />
        </button>
        <button
          className={clsx([
            "aspect-square rounded-lg bg-neutral-100 p-2 transition-colors dark:bg-neutral-900",
            editor.isActive("code")
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white",
          ])}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code size={20} />
        </button>
      </section>

      <section className="flex gap-0.5 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-100 px-2 py-1 dark:bg-neutral-900">
        <button
          className={clsx([
            "aspect-square rounded-lg bg-neutral-100 p-2 transition-colors dark:bg-neutral-900",
            editor.isActive("paragraph")
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white",
          ])}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <Paragraph size={20} />
        </button>
        <button
          className={clsx([
            "aspect-square rounded-lg bg-neutral-100 p-2 transition-colors dark:bg-neutral-900",
            editor.isActive("heading", { level: 1 })
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white",
          ])}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <TextHOne size={20} />
        </button>
        <button
          className={clsx([
            "aspect-square rounded-lg bg-neutral-100 p-2 transition-colors dark:bg-neutral-900",
            editor.isActive("heading", { level: 2 })
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white",
          ])}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <TextHTwo size={20} />
        </button>
        <button
          className={clsx([
            "aspect-square rounded-lg bg-neutral-100 p-2 transition-colors dark:bg-neutral-900",
            editor.isActive("heading", { level: 3 })
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white",
          ])}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <TextHThree size={20} />
        </button>
        <button
          className={clsx([
            "aspect-square rounded-lg bg-neutral-100 p-2 transition-colors dark:bg-neutral-900",
            editor.isActive("heading", { level: 4 })
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white",
          ])}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
        >
          <TextHFour size={20} />
        </button>
        <button
          className={clsx([
            "aspect-square rounded-lg bg-neutral-100 p-2 transition-colors dark:bg-neutral-900",
            editor.isActive("heading", { level: 5 })
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white",
          ])}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
        >
          <TextHFive size={20} />
        </button>
        <button
          className={clsx([
            "aspect-square rounded-lg bg-neutral-100 p-2 transition-colors dark:bg-neutral-900",
            editor.isActive("heading", { level: 6 })
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white",
          ])}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
        >
          <TextHSix size={20} />
        </button>
      </section>

      <section className="flex gap-0.5 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-100 px-2 py-1 dark:bg-neutral-900">
        <button
          className={clsx([
            "aspect-square rounded-lg bg-neutral-100 p-2 transition-colors dark:bg-neutral-900",
            editor.isActive("bulletList")
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white",
          ])}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <ListBullets size={20} />
        </button>
        <button
          className={clsx([
            "aspect-square rounded-lg bg-neutral-100 p-2 transition-colors dark:bg-neutral-900",
            editor.isActive("orderedList")
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white",
          ])}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListNumbers size={20} />
        </button>
        <button
          className={clsx([
            "aspect-square rounded-lg bg-neutral-100 p-2 transition-colors dark:bg-neutral-900",
            editor.isActive("codeBlock")
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white",
          ])}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <CodeBlock size={20} />
        </button>
        <button
          className={clsx([
            "aspect-square rounded-lg bg-neutral-100 p-2 transition-colors dark:bg-neutral-900",
            editor.isActive("blockquote")
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white",
          ])}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quotes size={20} />
        </button>
      </section>

      <section className="flex gap-0.5 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-100 px-2 py-1 dark:bg-neutral-900">
        <button
          className="aspect-square rounded-lg bg-neutral-100 p-2 text-neutral-600 transition-colors hover:text-black disabled:cursor-not-allowed disabled:opacity-40 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          disabled={!editor.can().chain().focus().undo().run()}
          onClick={() => editor.chain().focus().undo().run()}
          type="button"
        >
          <ArrowUDownLeft size={20} />
        </button>
        <button
          className="aspect-square rounded-lg bg-neutral-100 p-2 text-neutral-600 transition-colors hover:text-black disabled:cursor-not-allowed disabled:opacity-40 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          disabled={!editor.can().chain().focus().redo().run()}
          onClick={() => editor.chain().focus().redo().run()}
          type="button"
        >
          <ArrowUUpRight size={20} />
        </button>
      </section>

      <section className="flex gap-0.5 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-100 px-2 py-1 dark:bg-neutral-900">
        <input
          className={clsx([
            "aspect-square h-9 w-9 bg-neutral-100 transition-colors dark:bg-neutral-900",
            editor.isActive("textStyle")
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white",
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
  });

  return (
    <div className="flex flex-col gap-2">
      <MenuBar editor={editor} />
      <EditorContent
        className="focus-within:default-outline rounded-lg border border-neutral-800 bg-neutral-900 p-4 [&_*]:outline-none"
        editor={editor}
      />
    </div>
  );
}
