"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import Link from "next/link";

type FAQItem = {
  id: string;
  icon: IconName;
  question: string;
  answer: string;
};

export default function FAQsThree() {
  const faqItems: FAQItem[] = [
    {
      id: "item-1",
      icon: "clock",
      question: "When can I access UniMinder?",
      answer:
        "UniMinder is available 24/7 for all registered users. Whether you're a student, alumnus, or aspirant, you can log in anytime to connect, learn, and explore. Our support team is available Monday to Saturday from 9:00 AM to 7:00 PM IST.",
    },
    {
      id: "item-2",
      icon: "credit-card",
      question: "Is UniMinder free to use?",
      answer:
        "Yes, UniMinder offers free access to core features for students, alumni, and aspirants. We also provide premium features for mentorship, advanced tools, and exclusive events, which can be subscribed to on a monthly or yearly basis.",
    },
    {
      id: "item-3",
      icon: "users",
      question: "Who can join UniMinder?",
      answer:
        "UniMinder is open to students, alumni, and aspirants from any educational background. Students can learn and grow, alumni can mentor and give back, and aspirants can get guidance for their academic journey.",
    },
    {
      id: "item-4",
      icon: "globe",
      question: "Do you support international users?",
      answer:
        "Yes! UniMinder is a global platform. No matter where you are, you can join our community, attend sessions, and connect with peers, mentors, and alumni worldwide.",
    },
    {
      id: "item-5",
      icon: "book",
      question: "How can I find a mentor or guide?",
      answer:
        "Once you complete your onboarding, you can explore our mentor directory or community groups. You’ll be able to connect with alumni and professionals who match your field of study, career goals, or interests.",
    },
  ];

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <div className="md:w-1/3">
            <div className="sticky top-20">
              <h2 className="mt-4 text-3xl font-bold">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground mt-4">
                Can&apos;t find what you&apos;re looking for? Contact our{" "}
                <Link
                  href="#"
                  className="text-primary font-medium hover:underline"
                >
                  customer support team
                </Link>
              </p>
            </div>
          </div>
          <div className="md:w-2/3">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="bg-background shadow-xs rounded-lg border px-4 last:border-b"
                >
                  <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex size-6">
                        <DynamicIcon
                          name={item.icon}
                          className="m-auto size-4"
                        />
                      </div>
                      <span className="text-base">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <div className="px-9">
                      <p className="text-base">{item.answer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
