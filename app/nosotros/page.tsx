// app/nosotros/page.tsx
"use client";

import Image from "next/image";
import InnerNavbar from "@/components/layout/InnerNavbar";

const TEAM = [
  {
    id: 1,
    name: "Juanita Gutiérrez",
    lastname: "Serrano",
    role: "DIRECTORA CREATIVA",
    bio: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
    image: "/person.jpg",
  },
];

export default function NosotrosPage() {
  return (
    <main className="w-full bg-white overflow-x-hidden">
      <InnerNavbar />

      {TEAM.map((member) => (
        <section
          key={member.id}
          className="flex flex-col md:flex-row w-full h-screen"
        >
          {/* Columna izquierda — foto: altura fija desde el primer frame */}
          <div className="relative w-full h-[50vh] md:h-full md:w-[50%] flex-shrink-0">
            <Image
              src={member.image}
              alt={`${member.name} ${member.lastname}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center grayscale"
            />
          </div>

          {/* Columna derecha — info */}
          <div className="w-full md:w-[50%] flex flex-col justify-between px-10 md:px-16 pt-10 pb-16">
            <div>
              <h1 className="text-5xl font-medium tracking-tight text-black leading-[1.05] mb-3">
                {member.name}
                <br />
                {member.lastname}
              </h1>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mt-4">
                {member.role}
              </p>
            </div>

            <p className="text-sm md:text-base text-gray-700 leading-relaxed max-w-md mt-auto pt-16">
              {member.bio}
            </p>
          </div>
        </section>
      ))}
    </main>
  );
}
