"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { Extension } from "@tiptap/core";
import {
    BoldIcon,
    ItalicIcon,
    UnderlineIcon,
    LinkIcon,
    ImageIcon,
} from "lucide-react";

const FontSize = Extension.create({
    name: "fontSize",
    addOptions() {
        return { types: ["textStyle"] };
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: (element) => element.style.fontSize || null,
                        renderHTML: (attributes) => {
                            if (!attributes.fontSize) return {};
                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            };
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            setFontSize:
                (size) =>
                ({ chain }) => {
                    return chain()
                        .setMark("textStyle", { fontSize: size })
                        .run();
                },
        };
    },
});

const TextEditor = ({ onChange, content = "" }) => {
    const editor = useEditor({
        extensions: [
            StarterKit, // Includes Bold, Italic, Heading, BulletList, OrderedList, ListItem
            Underline,
            Link,
            Image,
            TextStyle,
            FontSize,
        ],
        content: content || "",
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false, // Fix SSR hydration issue
    });

    if (!editor) return null;

    return (
        <div className="border rounded-md shadow-md p-4 bg-white">
            {/* toolbar */}
            <div className="grid grid-cols-4 md:grid-cols-10 gap-2 mb-4">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded flex items-center justify-center md:h-10 border ${
                        editor.isActive("bold") ? "bg-color7" : "bg-gray-100"
                    }`}
                >
                    <BoldIcon size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded flex items-center justify-center md:h-10 border ${
                        editor.isActive("italic") ? "bg-color7" : "bg-gray-100"
                    }`}
                >
                    <ItalicIcon size={18} />
                </button>
                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleUnderline().run()
                    }
                    className={`p-2 rounded flex items-center justify-center md:h-10 border ${
                        editor.isActive("underline")
                            ? "bg-color7"
                            : "bg-gray-100"
                    }`}
                >
                    <UnderlineIcon size={18} />
                </button>

                <button
                    type="button"
                    onClick={() => {
                        const url = prompt("Enter URL:");
                        if (url)
                            editor.chain().focus().setLink({ href: url }).run();
                    }}
                    className="p-2 rounded flex items-center justify-center md:h-10 border bg-gray-100"
                >
                    <LinkIcon size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => {
                        const url = prompt("Enter Image URL:");
                        if (url)
                            editor.chain().focus().setImage({ src: url }).run();
                    }}
                    className="p-2 rounded flex items-center justify-center md:h-10 border bg-gray-100"
                >
                    <ImageIcon size={18} />
                </button>

                <input
                    type="number"
                    name="textSize"
                    id="textSize"
                    min="10"
                    max="100"
                    step="1"
                    value={
                        parseInt(editor.getAttributes("textStyle").fontSize) ||
                        16
                    }
                    onChange={(e) => {
                        const size = e.target.value
                            ? `${e.target.value}px`
                            : "16px";
                        editor.chain().focus().setFontSize(size).run();
                    }}
                    className="p-2 rounded flex items-center justify-center md:h-10 border bg-gray-100 focus:outline-0"
                />
            </div>

            {/* editor content */}
            <EditorContent
                editor={editor}
                className="p-2 min-h-[200px] border rounded"
            />
        </div>
    );
};

export default TextEditor;
