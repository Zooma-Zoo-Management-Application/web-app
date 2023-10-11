"use client"

import BackgroundVideo from "@/app/components/BackgroundVideo";
import Feature from "@/app/components/Feature";
import Header from "@/components/shared/Header";
import Hero from "@/app/components/Hero";
import Pricing from "@/app/components/Pricing";
import { Button } from "@/components/ui/button";
import useUIState from "@/stores/ui-store";
import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { getTickets } from "@/lib/api/ticketAPI";
import { getNews } from "@/lib/api/newAPI";
export default function Home() {
  const {isVideoMuted, setIsVideoMuted} = useUIState();
  const [tickets, setTickets] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const tickets = await getTickets();
        setTickets(tickets);
      } catch (err:any) {
        setError(`Error initializing the app: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, [])
  
  return (
    <>
      <Button variant="default" size="icon" 
        onClick={() => {
          setIsVideoMuted()
        }}
        className=
        "z-40 fixed bottom-20 lg:bottom-4 right-4 rounded-full p-2 outline-none transition-opacity duration-200"
        >
        {isVideoMuted ? <VolumeX /> : <Volume2 /> }
      </Button> 
      <Header />
      <Hero />
      <Feature />
      <Pricing tickets={tickets.data}/>
      <BackgroundVideo />
    </>
  )
}
