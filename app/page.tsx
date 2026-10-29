import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Currently from "@/components/Currently";
import About from "@/components/About";
import HowIThink from "@/components/HowIThink";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Stack from "@/components/Stack";
import OtherWork from "@/components/OtherWork";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <main>
            <Navbar />
            <Hero />
            <Currently />
            <About />
            <HowIThink />
            <Projects />
            <Experience />
            <Stack />
            <OtherWork />
            <Contact />
            <Footer />
        </main>
    );
}
