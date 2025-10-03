import Link from "next/link";

const links = [
  {
    title: "Features",
    href: "#features",
  },
  {
    title: "About Us",
    href: "#about",
  },
  {
    title: "Support",
    href: "#support",
  },
];

export default function FooterSection() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-12">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap justify-between gap-6">
          <span className="text-gray-600 dark:text-gray-400 order-last block text-center text-sm md:order-first">
            © {new Date().getFullYear()} UniMinder. Connecting university
            networks worldwide.
          </span>
          <div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary block duration-150"
              >
                <span>{link.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
