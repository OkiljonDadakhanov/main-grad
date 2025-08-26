import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-purple-900">Graduate in Korea</h3>
            <p className="text-sm text-gray-600">
              Connecting students with top universities in Korea and Uzbekistan for a brighter academic future.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-purple-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-purple-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/universities" className="text-gray-600 hover:text-purple-900">
                  Universities
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-600 hover:text-purple-900">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-gray-600 hover:text-purple-900">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-purple-900">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-purple-900 mb-4">Information</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/application-process" className="text-gray-600 hover:text-purple-900">
                  Application Process
                </Link>
              </li>
              <li>
                <Link href="/visa-requirements" className="text-gray-600 hover:text-purple-900">
                  Visa Requirements
                </Link>
              </li>
              <li>
                <Link href="/living-costs" className="text-gray-600 hover:text-purple-900">
                  Living Costs
                </Link>
              </li>
              <li>
                <Link href="/scholarships" className="text-gray-600 hover:text-purple-900">
                  Scholarships
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-purple-900 mb-4">Contact</h4>
            <address className="not-italic text-sm space-y-2 text-gray-600">
              <p>100011, Ўзбекистон, Тошкент, Шайхонтоҳур тумани, Навоий кўчаси, 2A-уй</p>
              <p>Email: gradabroadltd@gmail.com</p>
              <p>Phone: (71) 202 09 09</p>
            </address>
          </div>
        </div>

        <div className="border-t mt-12 pt-6 text-sm text-gray-600 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Graduate in Korea. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-purple-900">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-purple-900">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
