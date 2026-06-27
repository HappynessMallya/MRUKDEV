import { Mail, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ContactCard({
  email,
  phone,
}: {
  email: string;
  phone: string;
}) {
  const whatsappHref = `https://wa.me/${phone.replace(/\D/g, "")}`;

  return (
    <Card className="gap-3 p-5">
      <p className="text-sm font-medium">
        Contact this distributor to request more information
      </p>
      <div className="flex flex-col gap-2">
        <Button asChild variant="outline">
          <a href={`mailto:${email}`}>
            <Mail className="size-4" />
            Send Email
          </a>
        </Button>
        <Button asChild className="bg-whatsapp text-white hover:bg-whatsapp/90">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" />
            Contact on WhatsApp
          </a>
        </Button>
      </div>
    </Card>
  );
}
