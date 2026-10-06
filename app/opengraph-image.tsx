import { ImageResponse } from "next/og";

// Link preview for Telegram, WhatsApp, iMessage, X…: built at deploy time, no design file to keep in sync
export const alt = "sudakknqw — Software developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "edge";

const FG = "#FF5A1F";
const BG = "#100C09";

function Asterisk() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40">
      {[0, 45, 90, 135].map((a) => (
        <line key={a} x1="20" y1="2" x2="20" y2="38" stroke={FG} strokeWidth="3" transform={`rotate(${a} 20 20)`} />
      ))}
    </svg>
  );
}

/** TTF straight from Google Fonts, subset to the characters used (ImageResponse cannot read woff2) */
async function font(query: string, text: string) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?${query}&text=${encodeURIComponent(text)}`)).text();
  const url = css.match(/src: url\((.+?)\) format/)?.[1];
  if (!url) throw new Error("font not found: " + query);
  return (await fetch(url)).arrayBuffer();
}

export default async function OpengraphImage() {
  const sans = "sudakknqwGoodsoftwarestartsthesurface.SOFTWAREDEVELOPER·WEBPRODUCTS&AUTOMATION[]SUDAKKNQW.COM ";
  const [grotesk, serif] = await Promise.all([
    font("family=Inter+Tight:wght@500", sans),
    font("family=Instrument+Serif:ital@1", "{below}fc"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundImage: "radial-gradient(circle at 84% 56%, rgba(255,110,50,0.75), rgba(16,12,9,0) 45%)",
          backgroundColor: BG,
          color: FG,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40, fontFamily: "Grotesk" }}>
          <Asterisk />
          sudakknqw
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 112, fontFamily: "Grotesk", lineHeight: 0.95, letterSpacing: -6 }}>
          <span>
            Good so<span style={{ fontFamily: "Serif", letterSpacing: -2 }}>f</span>tware
          </span>
          <span>
            starts<span style={{ fontFamily: "Serif", letterSpacing: -2, marginLeft: 28 }}>{"{below}"}</span>
          </span>
          <span style={{ paddingLeft: 180 }}>
            the surfa<span style={{ fontFamily: "Serif", letterSpacing: -2 }}>c</span>e.
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, fontFamily: "Grotesk", opacity: 0.8 }}>
          <span>SOFTWARE DEVELOPER · WEB PRODUCTS & AUTOMATION</span>
          <span>[ SUDAKKNQW.COM ]</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Grotesk", data: grotesk, weight: 500, style: "normal" },
        { name: "Serif", data: serif, weight: 400, style: "italic" },
      ],
    }
  );
}
