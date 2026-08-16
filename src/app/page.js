import AboutPage from "@/components/AboutPage";
import AdvertisePage from "@/components/AdvertisePage";
import AdvertiseTicket from "@/components/AdvertiseTicket";
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
        <AdvertiseTicket></AdvertiseTicket>
        <PopularRoutes></PopularRoutes>
        <WhyChooseUs></WhyChooseUs>
        <ContactPage></ContactPage>
      </main>
    </div>
  );
}
