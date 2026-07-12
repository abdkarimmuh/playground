import { Braces, FileCode2, MonitorPlay, Save, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

const PLAYGROUNDS = [
  {
    href: "/js",
    icon: FileCode2,
    title: "JavaScript",
    description: "Write plain JavaScript and run it instantly in your browser."
  },
  {
    href: "/ts",
    icon: Braces,
    title: "TypeScript",
    description:
      "Write TypeScript with real type-checking, then run the compiled output."
  }
];

const FEATURES = [
  {
    icon: MonitorPlay,
    title: "Runs in your browser",
    description: "No server round-trip — code executes in a sandboxed iframe."
  },
  {
    icon: Sparkles,
    title: "Monaco editor",
    description:
      "The same editor that powers VS Code, with syntax highlighting and diagnostics."
  },
  {
    icon: Save,
    title: "Auto-saved locally",
    description: "Your code is saved to localStorage so it survives a refresh."
  }
];

export default function Page() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-16 md:px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-medium tracking-tight md:text-4xl">
          JS / TS Playground
        </h1>
        <p className="max-w-xl text-muted-foreground">
          A small, fast playground for trying out JavaScript and TypeScript
          snippets. Pick a language below to get started.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {PLAYGROUNDS.map((playground) => (
          <Card key={playground.href}>
            <CardHeader>
              <playground.icon className="mb-2 size-6" />
              <CardTitle>{playground.title}</CardTitle>
              <CardDescription>{playground.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                nativeButton={false}
                render={<Link href={playground.href} />}
              >
                Open {playground.title} playground
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="flex flex-col gap-2">
            <feature.icon className="size-5 text-muted-foreground" />
            <h2 className="font-medium">{feature.title}</h2>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
