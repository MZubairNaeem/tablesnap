import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ticket, TicketHeader, TicketPerforation } from "@/components/ui/ticket";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-20">
      <ThemeToggle className="absolute top-6 right-6" />
      <Ticket edge="bottom" className="w-full max-w-md pb-4">
        <TicketHeader business="Vouch" meta="Order up" />
        <TicketPerforation />
        <div className="flex flex-col gap-6 px-6 pt-6 pb-2">
          <h1 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance">
            Turn a good meal into a video testimonial
          </h1>
          <p className="text-[0.95rem] leading-relaxed text-muted-foreground text-balance">
            Put a QR code on the table. Diners answer a few questions on camera and get a discount.
            You review and publish in 30 seconds.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              render={<Link href="/signup">Get started free</Link>}
              nativeButton={false}
              size="xl"
              className="flex-1"
            />
            <Button
              render={<Link href="/login">Log in</Link>}
              nativeButton={false}
              variant="outline"
              size="xl"
              className="flex-1"
            />
          </div>
        </div>
      </Ticket>
    </div>
  );
}
