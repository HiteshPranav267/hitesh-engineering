import Link from "next/link";

export default function NotFound() {
    return (
        <main id="main" className="page">
            <h1>Not found</h1>
            <p className="lede">There is no page at this address.</p>
            <p>
                <Link href="/">Room</Link> · <Link href="/list/">List view</Link> · <Link href="/projects/">Projects</Link> · <Link href="/notes/">Notes</Link> · <Link href="/cv/">CV</Link>
            </p>
        </main>
    );
}
