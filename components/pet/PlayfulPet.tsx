"use client";

import { useEffect, useRef, useState } from "react";
import {
  Neko,
  NekoSizeVariations,
  breedSpriteSets,
  type BreedConfig,
} from "@/lib/pet/neko";

const SHEET_SRC = "/pet/dog.png";
const HEART_DISTANCE = 56;

const readAccent = () =>
  getComputedStyle(document.documentElement)
    .getPropertyValue("--accent")
    .trim() || "#7ec699";

const accentToRgb = (hex: string): [number, number, number] => {
  let h = hex.replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`failed to load sprite: ${src}`));
    img.src = src;
  });

let cachedSheet: Promise<HTMLImageElement> | null = null;
const getSheet = () => {
  if (!cachedSheet) cachedSheet = loadImage(SHEET_SRC);
  return cachedSheet;
};

/**
 * Accent-monochrome recolor: every opaque pixel is remapped to the theme
 * accent scaled by its own luminance (white -> accent, black stays black),
 * matching the ASCII portrait's accent-only look. Alpha is preserved.
 */
const recolorSheet = (img: HTMLImageElement, accentHex: string) => {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imageData.data;
  const [ar, ag, ab] = accentToRgb(accentHex);
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] === 0) continue;
    const lum =
      (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
    d[i] = Math.round(ar * lum);
    d[i + 1] = Math.round(ag * lum);
    d[i + 2] = Math.round(ab * lum);
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
};

const dogBreed = (src: string): BreedConfig => ({
  src,
  spriteSets: breedSpriteSets,
  gap: 1,
  cols: 8,
  rows: 4,
});

/**
 * A classic Neko-style pet dog that follows the cursor. The sprite is
 * recolored with the live `--accent` so it follows the theme switcher.
 * Desktop (fine pointer) only; touch devices get nothing.
 */
export function PlayfulPet() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heartsRef = useRef<HTMLDivElement>(null);
  const nekoRef = useRef<Neko | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    const hearts = heartsRef.current;
    if (!container || !hearts) return;

    let disposed = false;
    let observer: MutationObserver | null = null;

    const applyAccent = async () => {
      const img = await getSheet();
      if (disposed) return;
      nekoRef.current?.setBreed(dogBreed(recolorSheet(img, readAccent())));
    };

    const start = async () => {
      const img = await getSheet();
      if (disposed) return;
      nekoRef.current = new Neko({
        breed: dogBreed(recolorSheet(img, readAccent())),
        parent: container,
        nekoSize: NekoSizeVariations.MEDIUM,
        speed: 20,
        animationSpeed: 100,
        origin: { x: window.innerWidth - 96, y: window.innerHeight - 96 },
      });

      observer = new MutationObserver(() => void applyAccent());
      observer.observe(document.documentElement, { attributes: true });
    };

    const spawnHearts = (x: number, y: number) => {
      const pos = nekoRef.current?.position;
      if (!pos) return;
      if (Math.hypot(x - pos.x, y - pos.y) > HEART_DISTANCE) return;
      const accent = readAccent();
      const count = 5 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const el = document.createElement("span");
        el.textContent = "♥";
        el.style.position = "fixed";
        el.style.left = `${x + Math.random() * 26 - 13}px`;
        el.style.top = `${y + Math.random() * 26 - 13}px`;
        el.style.color = accent;
        el.style.fontSize = `${9 + Math.random() * 8}px`;
        el.style.lineHeight = "1";
        el.style.pointerEvents = "none";
        el.style.willChange = "transform, opacity";
        hearts.appendChild(el);
        el.animate(
          [
            { transform: "translate(0,0) scale(0.4) rotate(0deg)", opacity: 1 },
            {
              transform: `translate(${Math.random() * 40 - 20}px, ${-34 - Math.random() * 28}px) scale(1) rotate(${Math.random() * 40 - 20}deg)`,
              opacity: 0,
            },
          ],
          {
            duration: 650 + Math.random() * 250,
            easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
          }
        ).finished.then(() => el.remove());
      }
    };

    const onClick = (e: MouseEvent) => spawnHearts(e.clientX, e.clientY);

    void start();
    window.addEventListener("click", onClick);

    return () => {
      disposed = true;
      window.removeEventListener("click", onClick);
      observer?.disconnect();
      nekoRef.current?.destroy();
      nekoRef.current = null;
      hearts.replaceChildren();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={containerRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-10"
      />
      <div
        ref={heartsRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-20"
      />
    </>
  );
}
