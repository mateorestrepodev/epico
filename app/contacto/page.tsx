// app/contacto/page.tsx
import Footer from "@/components/layout/Footer";
import InnerNavbar from "@/components/layout/InnerNavbar";

export default function ContactoPage() {
  return (
    <main className="w-full min-h-screen bg-white flex flex-col">
      <InnerNavbar />

      {/* Contenido centrado verticalmente */}
      <div className="flex-1 flex items-center px-8 md:px-14">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-0">
          {/* Columna izquierda */}
          <div className="flex flex-col gap-8">
            {/* Email */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-black mb-2">
                Email
              </p>
              <p className="text-xs tracking-wide text-black leading-6">
                GENERAL -{" "}
                <a
                  href="mailto:info@epico.com"
                  className="hover:text-[#291df1] transition-colors"
                >
                  INFO@EPICO.COM
                </a>
              </p>
              <p className="text-xs tracking-wide text-black leading-6">
                COMMERCIAL/CONTRACT -{" "}
                <a
                  href="mailto:trade@epico.com"
                  className="hover:text-[#291df1] transition-colors"
                >
                  TRADE@EPICO.COM
                </a>
              </p>
              <p className="text-xs tracking-wide text-black leading-6">
                PRESS -{" "}
                <a
                  href="mailto:press@epico.com"
                  className="hover:text-[#291df1] transition-colors"
                >
                  PRESS@EPICO.COM
                </a>
              </p>
            </div>

            {/* Phone */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-black mb-2">
                Whatsapp{" "}
              </p>
              <a
                href="https://wa.me/573242548059"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full justify-center items-center gap-2 hover:text-epico-blue transition-colors cursor-pointer"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.06-.177-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="font-medium tracking-wide">324 254 80 59</span>
              </a>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="flex flex-col gap-8">
            {/* Studio */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-black mb-2">
                Studio / Showroom
              </p>
              <p className="text-xs tracking-wide text-black leading-6 uppercase">
                Calle X # X - X, El Poblado,
                <br />
                Medellín, Colombia
              </p>
            </div>

            {/* Horarios */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-black mb-2">
                Horarios
              </p>
              <p className="text-xs tracking-wide text-black leading-6 uppercase">
                Lunes - Jueves 9AM - 6PM
                <br />
                Viernes 9AM - 5:00PM
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
