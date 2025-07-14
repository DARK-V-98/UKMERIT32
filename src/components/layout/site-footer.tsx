import Link from "next/link";
import { BookOpen, Twitter, Github, Linkedin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">UK MERIT ACADEMY</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your partner in education and professional development.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground"><Twitter /></Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground"><Github /></Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground"><Linkedin /></Link>
            </div>
          </div>
          <div className="md:col-start-3 grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                  <h4 className="font-semibold mb-4">Platform</h4>
                  <ul className="space-y-2">
                      <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Features</Link></li>
                      <li><Link href="/lessons" className="text-sm text-muted-foreground hover:text-foreground">Lessons</Link></li>
                      <li><Link href="/forums" className="text-sm text-muted-foreground hover:text-foreground">Forums</Link></li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-semibold mb-4">Company</h4>
                  <ul className="space-y-2">
                      <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link></li>
                      <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Careers</Link></li>
                      <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link></li>
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
        </div>
      </div>
    </footer>
  );
}
