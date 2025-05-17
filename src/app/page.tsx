"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Recall System Tools</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/architecture-editor" className="group">
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <Image
                src="/globe.svg"
                alt="Architecture Editor"
                width={48}
                height={48}
              />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Architecture Editor</h2>
            <p>
              Model system architecture using interactive diagrams and YAML DSL.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
