import { MDXRemote } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";

const PLACEHOLDER = /^\[\[[A-Z ]+\]\]$/;

function P({ children }: { children?: ReactNode }) {
    if (typeof children === "string" && PLACEHOLDER.test(children.trim())) {
        return <p className="placeholder">{children}</p>;
    }
    return <p>{children}</p>;
}

export function Placeholder({ text = "[[HITESH WRITES THIS]]" }: { text?: string }) {
    return <p className="placeholder">{text}</p>;
}

export default function Mdx({ source }: { source: string }) {
    return (
        <div className="prose">
            <MDXRemote source={source} components={{ p: P }} />
        </div>
    );
}
