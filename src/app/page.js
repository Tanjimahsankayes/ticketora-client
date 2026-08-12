import AboutPage from "@/components/AboutPage";
import WhyChooseUs from "@/components/Chooseus";
import ContactPage from "@/components/ContactPage";
import Hero from "@/components/Hero";
import PopularRoutes from "@/components/PopularRoutes";

export default function Home() {
  return (
    <div className="font-sans">
      <main>
        <Hero></Hero>
        <AboutPage></AboutPage>
        <PopularRoutes></PopularRoutes>
        <WhyChooseUs></WhyChooseUs>
        <ContactPage></ContactPage>
      </main>
    </div>
  );
}
