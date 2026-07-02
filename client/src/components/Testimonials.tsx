/* ============================================================
   Testimonials Component
   Displays a carousel of user testimonials
   ============================================================ */

import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface Testimonial {
  quote: string;
  author: string;
  location: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "EcoBelle Volt has transformed my daily commute! Finding a charging station is now effortless, and the app is incredibly user-friendly. Highly recommended for all EV owners in Ghana.",
    author: "Ama K. Boateng",
    location: "Accra, Ghana",
  },
  {
    quote: "Reliable, fast, and always available. EB Volt has taken away my range anxiety completely. The stations are well-maintained, and the payment process is seamless with MTN MoMo.",
    author: "Kwame Mensah",
    location: "Kumasi, Ghana",
  },
  {
    quote: "As a fleet manager, ensuring our electric vehicles are always charged is crucial. EcoBelle Volt's network and admin dashboard make it easy to monitor and manage our fleet's charging needs efficiently.",
    author: "Adwoa Serwaa",
    location: "Tema, Ghana",
  },
  {
    quote: "I love the convenience! I can find a charger, reserve a slot, and pay all from my phone. It's a game-changer for electric vehicle adoption in Ghana.",
    author: "Kofi Owusu",
    location: "Takoradi, Ghana",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24" style={{ background: "oklch(0.97 0 0)" }}>
      <div className="container">
        <h2
          className="text-4xl md:text-5xl font-bold text-center mb-12"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}
        >
          What Our Drivers Say
        </h2>

        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="h-full flex flex-col justify-between" style={{ border: "1px solid oklch(0.9 0.01 240)", background: "oklch(0.98 0 0)" }}>
                    <CardContent className="flex flex-col justify-between p-6 h-full">
                      <p className="text-lg italic mb-6" style={{ color: "oklch(0.25 0.08 240)" }}>
                        &quot;{testimonial.quote}&quot;
                      </p>
                      <div>
                        <p className="font-semibold" style={{ color: "oklch(0.25 0.08 240)" }}>
                          {testimonial.author}
                        </p>
                        <p className="text-sm" style={{ color: "oklch(0.62 0.01 240)" }}>
                          {testimonial.location}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious style={{ color: "oklch(0.25 0.08 240)", borderColor: "oklch(0.9 0.01 240)" }} />
          <CarouselNext style={{ color: "oklch(0.25 0.08 240)", borderColor: "oklch(0.9 0.01 240)" }} />
        </Carousel>
      </div>
    </section>
  );
}
