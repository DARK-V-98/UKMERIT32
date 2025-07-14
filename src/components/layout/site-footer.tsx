
import Link from "next/link";
import Image from "next/image";
import { Youtube, Facebook, Mail, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/uk.png" alt="UK MERIT ACADEMY (PVT) LTD Logo" width={180} height={45} className="object-contain" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Your partner in education and professional development.
            </p>
            <div className="flex gap-4">
              <Link href="https://www.youtube.com/@FreeEnglishinSinhala" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Youtube /></Link>
              <Link href="https://www.facebook.com/FreeEnglishSinhala?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Facebook /></Link>
            </div>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                  <h4 className="font-semibold mb-4">Platform</h4>
                  <ul className="space-y-2">
                      <li><Link href="/courses" className="text-sm text-muted-foreground hover:text-foreground">Courses</Link></li>
                      <li><Link href="/lessons" className="text-sm text-muted-foreground hover:text-foreground">Lessons</Link></li>
                      <li><Link href="/forums" className="text-sm text-muted-foreground hover:text-foreground">Forums</Link></li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-semibold mb-4">Contact Us</h4>
                  <ul className="space-y-2">
                      <li><a href="mailto:Fesappmail@gmail.com" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"><Mail className="h-4 w-4"/>Email</a></li>
                      <li><a href="https://wa.me/702210310" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"><Phone className="h-4 w-4"/>WhatsApp</a></li>
                  </ul>
              </div>
               <div>
                  <h4 className="font-semibold mb-4">Legal</h4>
                  <ul className="space-y-2">
                      <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link></li>
                      <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link></li>
                  </ul>
              </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} UK MERIT ACADEMY (PVT) LTD. All rights reserved.
          <br />
          Powered by{" "}
          <Link
            href="https://www.esystemlk.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            esystemlk
          </Link>
        </div>
      </div>
    </footer>
  );
}
