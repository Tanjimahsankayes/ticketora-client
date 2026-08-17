import AboutPage from "@/components/AboutPage";
import AdvertiseTicket from "@/components/AdvertiseTicket";
import WhyChooseUs from "@/components/Chooseus";
import ContactPage from "@/components/ContactPage";
import Hero from "@/components/Hero";
import LatestTickets from "@/components/LastestTicket";
import PopularRoutes from "@/components/PopularRoutes";

export default function Home() {
  return (
    <div className="font-sans">
      <main>
        <Hero></Hero>
        <AdvertiseTicket></AdvertiseTicket>
        <LatestTickets></LatestTickets>
        <AboutPage></AboutPage>
        <PopularRoutes></PopularRoutes>
        <WhyChooseUs></WhyChooseUs>
        <ContactPage></ContactPage>
      </main>
    </div>
  );
}
