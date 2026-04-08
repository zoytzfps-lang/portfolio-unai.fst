import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import {
  HashRouter,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import perfil from "./assets/perfil.jpg";
import videoarteComingHome from "./assets/videoarte/coming home.mp4";
import videoarteComingHomePoster from "./assets/videoarte/coming home.jpg";
import videoarteManifesto from "./assets/videoarte/manifesto.web.mp4";
import videoarteManifestoPoster from "./assets/videoarte/manifesto.jpg";
import videoarteTren from "./assets/videoarte/tren_1.web.mp4";
import videoarteTrenPoster from "./assets/videoarte/tren.jpg";
import videoarteYou from "./assets/videoarte/you.mp4";
import videoarteYouPoster from "./assets/videoarte/you..jpg";
import "./App.css";

const MotionHeader = motion.header;
const MotionSection = motion.section;
const MotionArticle = motion.article;
const MotionDiv = motion.div;
const MotionAnchor = motion.a;

const photoSessionModules = import.meta.glob("./assets/*/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
});

const photoSessionConfig = {
  "fotos hoke": {
    title: "Hoke en directo",
    location: "Plaza de Toros, Valencia",
    description:
      "Una serie realizada durante el concierto de Hoke en la Plaza de Toros de Valencia, combinando planos abiertos del recinto con momentos más cercanos de energía, gesto y presencia en directo.",
  },
  "fotos rio": {
    title: "Amanecer en el Turia",
    location: "Jardín del Turia, Valencia",
    description:
      "Una sesión tomada al amanecer en el cauce del río Turia, centrada en la luz temprana, la calma del paisaje y las texturas que aparecen en la ciudad antes de que despierte del todo.",
  },
  "fotos dana": {
    title: "Un año después de la DANA",
    location: "Paiporta, Valencia",
    description:
      "Fotografías realizadas en Paiporta durante el homenaje celebrado un año después de la DANA del 29 de octubre de 2024, con un enfoque documental y atento a la memoria colectiva del momento.",
  },
  "fotos own zaragoza": {
    title: "RedRevenge en OWN Zaragoza",
    location: "OWN Zaragoza",
    description:
      "Cobertura fotográfica realizada para el equipo RedRevenge durante su estancia en OWN Zaragoza, recogiendo ambiente, momentos de equipo y la intensidad del evento desde dentro.",
  },
  "fotos dillom": {
    title: "Dillom en Sala Moon",
    location: "Sala Moon, Valencia",
    description:
      "Una serie centrada en el concierto de Dillom en Sala Moon, buscando contraste, atmósfera y presencia escénica a través de la luz, el humo y la energía de la sala.",
  },
  "fotos homenaje DANA paiporta": {
    hidden: true,
  },
};

const photoSessionOrder = [
  "fotos dillom",
  "fotos hoke",
  "fotos own zaragoza",
  "fotos rio",
  "fotos dana",
];

function getOrderedPhotoEntries(photoEntries) {
  return [...photoEntries].sort(([pathA], [pathB]) => {
    const getOrder = (path) =>
      Number(path.match(/(\d+)\.(jpg|jpeg|png|webp)$/i)?.[1] ?? Number.MAX_SAFE_INTEGER);

    return getOrder(pathA) - getOrder(pathB);
  });
}

function formatSessionTitle(folderName) {
  return folderName
    .replace(/^fotos\s+/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function buildPhotoSessions() {
  const groupedSessions = Object.entries(photoSessionModules).reduce((sessions, [path, source]) => {
    const folderName = path.split("/")[2];

    if (!folderName) {
      return sessions;
    }

    if (!sessions[folderName]) {
      sessions[folderName] = [];
    }

    sessions[folderName].push([path, source]);
    return sessions;
  }, {});

  return Object.entries(groupedSessions)
    .sort(([folderA], [folderB]) => {
      const orderA = photoSessionOrder.indexOf(folderA);
      const orderB = photoSessionOrder.indexOf(folderB);

      if (orderA !== -1 || orderB !== -1) {
        if (orderA === -1) {
          return 1;
        }

        if (orderB === -1) {
          return -1;
        }

        return orderA - orderB;
      }

      return folderA.localeCompare(folderB);
    })
    .map(([folderName, entries]) => {
      const config = photoSessionConfig[folderName] ?? {};
      const photos = getOrderedPhotoEntries(entries).map(([, source], photoIndex) => ({
        src: source,
        alt: `${config.title ?? formatSessionTitle(folderName)}, foto ${photoIndex + 1}`,
      }));

      return {
        id: folderName,
        title: config.title ?? formatSessionTitle(folderName),
        location: config.location ?? "Ubicación por añadir",
        description:
          config.description ??
          "Sesión fotográfica añadida al portfolio. Puedes personalizar el título, la ubicación y el texto cuando quieras.",
        photos,
      };
    })
    .filter((session) => !photoSessionConfig[session.id]?.hidden);
}

const photoSessions = buildPhotoSessions();

const collaboratorProfiles = [
  {
    name: "TRVNSITS",
    profileUrl: "https://open.spotify.com/artist/64GpxWNMsELo5BCIsMoYzC?si=48e192d42f974b22",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eb21999184da7073da8c3e172f",
  },
  {
    name: "PESET",
    profileUrl: "https://open.spotify.com/artist/6NjnUSNw9whIWNP3leVJ1y?si=cdc4b4b204df452e",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eb2003879610b90321424de357",
  },
  {
    name: "FLOATY",
    profileUrl: "https://open.spotify.com/artist/7oRvUL9ZK4p46wnkPXDDbK?si=af99585c2be64dfd",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5ebe237ef3634bb6d3359ef87d9",
  },
  {
    name: "bycaa",
    profileUrl: "https://open.spotify.com/artist/0ExyLsORVd7lUl9tMLUcXH?si=6014abdce2c54676",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eb7e55d1addba114c5d2bfa921",
  },
  {
    name: "RedRevenge",
    profileUrl: "https://x.com/RedRevengeEC",
    imageUrl: "https://unavatar.io/x/RedRevengeEC",
  },
];

function sortByNewest(items) {
  return [...items].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

function getYouTubeEmbedUrl(url) {
  if (!url) {
    return url;
  }

  if (url.includes("youtube.com/embed/")) {
    return url;
  }

  try {
    const parsedUrl = new URL(url);
    const videoId =
      parsedUrl.searchParams.get("v") ||
      parsedUrl.pathname.split("/").filter(Boolean).pop();

    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } catch {
    return url;
  }
}

function getYouTubeWatchUrl(url) {
  if (!url) {
    return url;
  }

  try {
    const parsedUrl = new URL(url);
    const videoId =
      parsedUrl.searchParams.get("v") ||
      parsedUrl.pathname.split("/").filter(Boolean).pop();

    return videoId ? `https://www.youtube.com/watch?v=${videoId}` : url;
  } catch {
    return url;
  }
}

function getYouTubeThumbnailUrl(url) {
  if (!url) {
    return "";
  }

  try {
    const parsedUrl = new URL(url);
    const videoId =
      parsedUrl.searchParams.get("v") ||
      parsedUrl.pathname.split("/").filter(Boolean).pop();

    return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "";
  } catch {
    return "";
  }
}

function sortToolNames(tools) {
  if (!Array.isArray(tools)) {
    return [];
  }

  const toolPriority = {
    Blender: 1,
    TouchDesigner: 2,
    "After Effects": 3,
    "Flora Fauna AI": 4,
    ReShade: 5,
    "Premiere Pro": 99,
  };

  return [...tools].sort((toolA, toolB) => {
    const priorityA = toolPriority[toolA] ?? 99;
    const priorityB = toolPriority[toolB] ?? 99;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return 0;
  });
}

function renderVideoCaption(video) {
  return (
    <div className="video-caption">
      {video.roleLine ? (
        <p className="video-meta">
          <span className="video-meta-label">Rol</span>
          {video.roleLine}
        </p>
      ) : null}

      {video.tools?.length ? (
        <p className="video-meta">
          <span className="video-meta-label">{"Herramientas de edici\u00f3n"}</span>
          {sortToolNames(video.tools).join(" \u00b7 ")}
        </p>
      ) : null}

      {video.note ? <p className="video-note">{video.note}</p> : null}
    </div>
  );
}

function PhotoSessionCarousel({ session }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const totalPhotos = session.photos.length;
  const activePhoto = session.photos[activeIndex];

  const showPreviousPhoto = useCallback(() => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? totalPhotos - 1 : currentIndex - 1
    );
  }, [totalPhotos]);

  const showNextPhoto = useCallback(() => {
    setActiveIndex((currentIndex) =>
      currentIndex === totalPhotos - 1 ? 0 : currentIndex + 1
    );
  }, [totalPhotos]);

  useEffect(() => {
    if (!isLightboxOpen) {
      return undefined;
    }

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
      }

      if (event.key === "ArrowLeft") {
        showPreviousPhoto();
      }

      if (event.key === "ArrowRight") {
        showNextPhoto();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, showNextPhoto, showPreviousPhoto]);

  return (
    <>
      <MotionArticle
        className="detail-card photo-session-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.12 }}
      >
        <div className="photo-session-copy">
          <h2>{session.title}</h2>
          <p>{session.description}</p>
        </div>

        <div className="photo-carousel">
          <button
            type="button"
            className="photo-carousel-stage"
            onClick={() => setIsLightboxOpen(true)}
            aria-label={`Ampliar foto actual de ${session.title}`}
          >
            <img
              key={activePhoto.src}
              src={activePhoto.src}
              alt={activePhoto.alt}
              className="photo-carousel-image"
              loading="lazy"
              decoding="async"
            />
            <span className="photo-location-tag">{session.location}</span>
            <div className="photo-carousel-counter">
              {String(activeIndex + 1).padStart(2, "0")} / {String(totalPhotos).padStart(2, "0")}
            </div>
            <span className="photo-expand-hint">Ampliar</span>
          </button>

          <div className="photo-carousel-controls">
            <button
              type="button"
              className="photo-carousel-button"
              onClick={showPreviousPhoto}
              aria-label={`Ver foto anterior de ${session.title}`}
            >
              Anterior
            </button>
            <button
              type="button"
              className="photo-carousel-button"
              onClick={showNextPhoto}
              aria-label={`Ver foto siguiente de ${session.title}`}
            >
              Siguiente
            </button>
          </div>

          <div className="photo-carousel-thumbs" aria-label={`Miniaturas de ${session.title}`}>
            {session.photos.map((photo, index) => (
              <button
                key={photo.src}
                type="button"
                className={`photo-thumb${index === activeIndex ? " is-active" : ""}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Ver foto ${index + 1} de ${session.title}`}
              >
                <img src={photo.src} alt="" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        </div>
      </MotionArticle>

      {isLightboxOpen
        ? createPortal(
            <div
              className="photo-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={`Vista ampliada de ${session.title}`}
              onClick={() => setIsLightboxOpen(false)}
            >
              <div
                className="photo-lightbox-panel"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  className="photo-lightbox-close"
                  onClick={() => setIsLightboxOpen(false)}
                  aria-label="Cerrar imagen ampliada"
                >
                  Cerrar
                </button>
                <div className="photo-lightbox-stage">
                  <div className="photo-lightbox-main">
                    <figure className="photo-lightbox-figure">
                      <img
                        src={activePhoto.src}
                        alt={activePhoto.alt}
                        className="photo-lightbox-image"
                        loading="eager"
                        decoding="async"
                      />
                    </figure>
                    <div className="photo-lightbox-controls">
                      <button
                        type="button"
                        className="photo-lightbox-nav"
                        onClick={showPreviousPhoto}
                        aria-label={`Ver foto anterior de ${session.title}`}
                      >
                        Anterior
                      </button>
                      <button
                        type="button"
                        className="photo-lightbox-nav"
                        onClick={showNextPhoto}
                        aria-label={`Ver foto siguiente de ${session.title}`}
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                  <div className="photo-lightbox-thumbs-wrap">
                    <div
                      className="photo-carousel-thumbs"
                      aria-label={`Miniaturas de ${session.title}`}
                    >
                      {session.photos.map((photo, index) => (
                        <button
                          key={photo.src}
                          type="button"
                          className={`photo-thumb${index === activeIndex ? " is-active" : ""}`}
                          onClick={() => setActiveIndex(index)}
                          aria-label={`Ver foto ${index + 1} de ${session.title}`}
                        >
                          <img src={photo.src} alt="" loading="lazy" decoding="async" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <figcaption className="photo-lightbox-caption">
                  <span>{session.title}</span>
                  <span>{session.location}</span>
                  <span>
                    {String(activeIndex + 1).padStart(2, "0")} / {String(totalPhotos).padStart(2, "0")}
                  </span>
                </figcaption>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

function ArtistGrid() {
  return (
    <section className="artist-grid">
      {collaboratorProfiles.map((artist, index) => (
        <MotionAnchor
          key={artist.profileUrl}
          href={artist.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="artist-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 * index }}
          aria-label={`Abrir perfil de ${artist.name}`}
        >
          <div className="artist-avatar-ring">
            {artist.imageUrl ? (
              <img
                src={artist.imageUrl}
                alt={`Foto de perfil de ${artist.name}`}
                className="artist-avatar"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span className="artist-avatar-fallback" aria-hidden="true">
                {artist.initials ?? artist.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <span className="artist-name">{artist.name}</span>
        </MotionAnchor>
      ))}
    </section>
  );
}

const navItems = [
  { label: "Videoclips y Visualizers", path: "/audiovisual" },
  { label: "Videoarte", path: "/videoarte" },
  { label: "Documental", path: "/documental" },
  { label: "Fotograf\u00edas", path: "/fotografias" },
  { label: "Artistas", path: "/artistas" },
  { label: "Contacto", path: "/contacto" },
];

const pageContent = {
  audiovisual: {
    eyebrow: "Portfolio audiovisual",
    title: "Videoclips y Visualizers",
    intro:
      "Una selecci\u00f3n de trabajos audiovisuales centrados en videoclips y visualizers, donde se recoge mi enfoque visual, la atm\u00f3sfera de cada pieza y mi papel dentro de la producci\u00f3n.",
    sections: [
      {
        title: "Videoclips",
        text:
          "En esta secci\u00f3n se recogen algunos de los videoclips en los que he trabajado, mostrando cada pieza de forma directa para que el enfoque visual y la energ\u00eda del proyecto hablen por s\u00ed mismos. Debajo de cada v\u00eddeo se indicar\u00e1 mi funci\u00f3n dentro de la producci\u00f3n.",
        videos: [
          {
            title: "LA \u00daLTIMA CENA",
            embedUrl: "https://www.youtube.com/embed/BxaWkFBw0fs",
            publishedAt: "2025-05-02T12:51:34-07:00",
            roleLine: "C\u00e1mara, edici\u00f3n, color y postproducci\u00f3n.",
            tools: ["Premiere Pro", "After Effects", "Flora Fauna AI"],
          },
          {
            title: "MUERTO EN MADRID",
            embedUrl: "https://www.youtube.com/embed/_HKCjvM8oE4",
            publishedAt: "2025-01-28T15:00:06-08:00",
            roleLine: "C\u00e1mara, edici\u00f3n, color y postproducci\u00f3n.",
            tools: ["Premiere Pro"],
            note: "Grabado con una c\u00e1mara VHS.",
          },
          {
            title: "M\u00c1S DE LO QUE QUIERO",
            embedUrl: "https://www.youtube.com/embed/Xf5Eu2TJEXs",
            publishedAt: "2025-01-13T15:00:06-08:00",
            roleLine: "Edici\u00f3n, color y postproducci\u00f3n.",
            tools: ["Premiere Pro", "ReShade"],
          },
        ],
      },
      {
        title: "Visualizers",
        text:
          "Esta parte del portfolio est\u00e1 dedicada a visualizers y piezas audiovisuales m\u00e1s experimentales, donde exploro ritmo, textura, reactividad y atm\u00f3sferas visuales adaptadas a cada canci\u00f3n. Debajo de cada v\u00eddeo se indicar\u00e1 mi funci\u00f3n dentro de la producci\u00f3n.",
        videos: [
          {
            title: "ON MY WAY ft. PESET",
            embedUrl: "https://www.youtube.com/embed/UCunnY58rUU",
            publishedAt: "2026-03-28T11:03:58-07:00",
            roleLine: "3D Modeling, edici\u00f3n, color y postproducci\u00f3n.",
            tools: ["Blender", "TouchDesigner", "Premiere Pro"],
          },
          {
            title: "Mal en Mejor",
            embedUrl: "https://www.youtube.com/embed/IQP0rWt7Jlc",
            publishedAt: "2025-12-26T15:00:20-08:00",
            roleLine: "C\u00e1mara, edici\u00f3n, color y postproducci\u00f3n.",
            tools: ["Premiere Pro", "After Effects"],
          },
          {
            title: "DFR",
            embedUrl: "https://www.youtube.com/embed/B9bXjZT3dQs",
            publishedAt: "2025-12-11T15:00:06-08:00",
            roleLine: "Edici\u00f3n, color y postproducci\u00f3n.",
            tools: ["Premiere Pro", "After Effects"],
          },
          {
            title: "ASINTOM\u00c1TICO",
            embedUrl: "https://www.youtube.com/embed/vaviQfB8x1k",
            publishedAt: "2025-09-26T15:01:14-07:00",
            roleLine: "C\u00e1mara, edici\u00f3n, color y postproducci\u00f3n.",
            tools: ["Premiere Pro", "After Effects"],
          },
          {
            title: "LES GANO A TODOS",
            embedUrl: "https://www.youtube.com/embed/XstbIZwpp2I",
            publishedAt: "2025-09-26T15:00:42-07:00",
            roleLine: "C\u00e1mara, edici\u00f3n, color y postproducci\u00f3n.",
            tools: ["Premiere Pro", "After Effects"],
          },
          {
            title: "OTRO PARA AMAR",
            embedUrl: "https://www.youtube.com/embed/YoWbkGqVYVU",
            publishedAt: "2025-09-26T15:00:41-07:00",
            roleLine: "C\u00e1mara, edici\u00f3n, color y postproducci\u00f3n.",
            tools: ["Premiere Pro", "After Effects"],
          },
          {
            title: "FUGAZ",
            embedUrl: "https://www.youtube.com/embed/_0zrFAmkWOw",
            publishedAt: "2025-07-04T05:12:10-07:00",
            roleLine: "Edici\u00f3n, color y postproducci\u00f3n.",
            tools: ["Premiere Pro"],
          },
          {
            title: "FLORES",
            embedUrl: "https://www.youtube.com/embed/j9b7gjdRFd8",
            publishedAt: "2025-05-02T11:00:50-07:00",
            roleLine: "Edici\u00f3n, color y postproducci\u00f3n.",
            tools: ["TouchDesigner", "Premiere Pro"],
          },
          {
            title: "CENTRAL PARK ft. PESET",
            embedUrl: "https://www.youtube.com/embed/Tt0NWjvdC6k",
            publishedAt: "2025-05-02T11:00:36-07:00",
            roleLine: "Edici\u00f3n, color y postproducci\u00f3n.",
            tools: ["TouchDesigner", "Premiere Pro"],
          },
          {
            title: "TEEN TITAN",
            embedUrl: "https://www.youtube.com/embed/ORp-9-4-iF0",
            publishedAt: "2025-05-02T11:00:33-07:00",
            roleLine: "Edici\u00f3n, color y postproducci\u00f3n.",
            tools: ["TouchDesigner", "Premiere Pro"],
          },
          {
            title: "GOD NEWS ft. NOTU",
            embedUrl: "https://www.youtube.com/embed/8JoMjRuCsHA",
            publishedAt: "2025-05-02T11:00:13-07:00",
            roleLine: "Edici\u00f3n, color y postproducci\u00f3n.",
            tools: ["TouchDesigner", "Premiere Pro"],
          },
          {
            title: "GLORY & PAIN",
            embedUrl: "https://www.youtube.com/embed/H2hFee1l1lM",
            publishedAt: "2025-04-08T15:00:26-07:00",
            roleLine: "C\u00e1mara, edici\u00f3n, color y postproducci\u00f3n.",
            tools: ["Premiere Pro", "After Effects"],
          },
          {
            title: "Donde Sea",
            embedUrl: "https://www.youtube.com/embed/0su0-9bbxO8",
            publishedAt: "2024-12-26T18:46:12-08:00",
            roleLine: "C\u00e1mara, edici\u00f3n, color y postproducci\u00f3n.",
            tools: ["Premiere Pro"],
            note: "Grabado con una c\u00e1mara VHS.",
          },
          {
            title: "Indica",
            embedUrl: "https://www.youtube.com/embed/s_CDb8hWPNQ",
            publishedAt: "2024-12-26T18:43:45-08:00",
            roleLine: "C\u00e1mara, edici\u00f3n, color y postproducci\u00f3n.",
            tools: ["Premiere Pro"],
            note: "Grabado con una c\u00e1mara VHS.",
          },
          {
            title: "Mien Tete",
            embedUrl: "https://www.youtube.com/embed/EPb9Wps0m9g",
            publishedAt: "2024-12-26T18:40:36-08:00",
            roleLine: "C\u00e1mara, edici\u00f3n, color y postproducci\u00f3n.",
            tools: ["Premiere Pro"],
            note: "Grabado con una c\u00e1mara VHS.",
          },
        ],
      },
    ],
  },
  videoarte: {
    eyebrow: "Piezas experimentales",
    title: "Videoarte",
    intro:
      "Una selecci\u00f3n de piezas breves y experimentales donde trabajo el montaje, la atm\u00f3sfera y el ritmo desde una vertiente m\u00e1s personal.",
    videos: [
      {
        title: "Coming Home",
        videoSrc: videoarteComingHome,
        posterSrc: videoarteComingHomePoster,
        publishedAt: "2025-01-31T00:00:00+01:00",
        externalUrl: "https://www.instagram.com/p/DFnplktoOJR/",
      },
      {
        title: "You.",
        videoSrc: videoarteYou,
        posterSrc: videoarteYouPoster,
        publishedAt: "2025-02-01T00:00:00+01:00",
        externalUrl: "https://www.instagram.com/p/DFnqF51InuY/",
      },
      {
        title: "Manifesto",
        videoSrc: videoarteManifesto,
        posterSrc: videoarteManifestoPoster,
        publishedAt: "2025-04-01T00:00:00+02:00",
        externalUrl: "https://www.instagram.com/p/DQK7zpACDMc/",
      },
      {
        title: "Tren.",
        videoSrc: videoarteTren,
        posterSrc: videoarteTrenPoster,
        publishedAt: "2025-07-01T00:00:00+02:00",
        externalUrl: "https://www.instagram.com/p/DSWEcDHCD87/",
      },
    ],
  },
  documental: {
    eyebrow: "Formato largo",
    title: "Documental",
    intro:
      "En esta secci\u00f3n se recogen las piezas documentales en las que he trabajado, mostrando cada proyecto de forma m\u00e1s pausada y centrada en la narrativa, la atm\u00f3sfera y el tratamiento visual.",
    videos: [
      {
        title: "MUERTO EN MADRID | Documental",
        embedUrl: "https://www.youtube.com/watch?v=FQwBmJcS-PA",
        displayAsLink: true,
        publishedAt: "2025-02-06T15:00:13-08:00",
        roleLine: "C\u00e1mara, edici\u00f3n, color y postproducci\u00f3n.",
        tools: ["Premiere Pro"],
        note: "Grabado con una c\u00e1mara VHS.",
      },
    ],
  },
  fotografias: {
    eyebrow: "Imagen fija",
    title: "Fotograf\u00edas",
    intro:
      "Una selecci\u00f3n de sesiones fotogr\u00e1ficas donde el ritmo, la presencia del artista y la atm\u00f3sfera del directo marcan cada imagen.",
    sessions: photoSessions,
  },
  artistas: {
    eyebrow: "Colaboraciones",
    title: "¿Con quién he trabajado?",
    intro:
      "Una selecci\u00f3n de artistas y equipos con los que he colaborado en distintos proyectos audiovisuales y fotogr\u00e1ficos. Desde aqu\u00ed puedes acceder r\u00e1pidamente a sus perfiles y p\u00e1ginas oficiales.",
    bullets: [
      "Tarjetas o logos de artistas con enlace a su proyecto.",
      "Resumen del tipo de colaboraci\u00f3n con cada uno.",
      "Posibilidad de enlazar a un videoclip, visualizer o sesi\u00f3n concreta.",
    ],
  },
  contacto: {
    eyebrow: "Contacto profesional",
    title: "Contacto",
    intro:
      "Si quieres contactar conmigo para videoclips, visualizers, fotograf\u00eda, edici\u00f3n o propuestas creativas, aqu\u00ed tienes mis v\u00edas principales de contacto.",
    contactItems: [
      {
        label: "Correo",
        value: "unaifossaticontact@gmail.com",
        href: "mailto:unaifossaticontact@gmail.com",
      },
      {
        label: "Instagram",
        value: "@unai.fst",
        href: "https://www.instagram.com/unai.fst/",
      },
      {
        label: "Tel\u00e9fono",
        value: "+34 622 70 70 88",
        href: "tel:+34622707088",
      },
    ],
  },
};

function Navigation() {
  return (
    <MotionHeader
      className="top-nav"
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <MotionDiv initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <NavLink to="/" end className={({ isActive }) => navClassName(isActive)}>
          Sobre mí
        </NavLink>
      </MotionDiv>

      {navItems.map((item, index) => (
        <MotionDiv
          key={item.path}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 * (index + 1) }}
        >
          <NavLink
            to={item.path}
            className={({ isActive }) => navClassName(isActive)}
          >
            {item.label}
          </NavLink>
        </MotionDiv>
      ))}
    </MotionHeader>
  );
}

function navClassName(isActive) {
  return `nav-link${isActive ? " is-active" : ""}`;
}

function HomePage() {
  return (
    <main className="page-shell home-shell">
      <section className="hero-layout">
        <MotionArticle
          className="info-card"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <p className="card-kicker">{"Sobre m\u00ed"}</p>
          <h1>Unai Fossati</h1>
          <p>
            {"Soy filmmaker, fot\u00f3grafo y editor de v\u00eddeo y foto."}
            <br />
            {
              "Me enfoco en crear piezas visuales para m\u00fasica, conciertos, artistas y proyectos donde la imagen tenga personalidad, ritmo y una direcci\u00f3n clara."
            }
          </p>
          <p>
            {
              "Me interesa que cada trabajo tenga intenci\u00f3n, desde la grabaci\u00f3n hasta la edici\u00f3n final, cuidando tanto la est\u00e9tica como la energ\u00eda que transmite."
            }
          </p>
        </MotionArticle>

        <MotionDiv
          className="portrait-wrap"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="portrait-ring">
            <img
              src={perfil}
              alt="Retrato de Unai Fossati"
              className="portrait-image"
              loading="eager"
              decoding="async"
            />
          </div>
        </MotionDiv>

        <MotionArticle
          className="info-card"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <p className="card-kicker">Estudios, experiencia e idiomas</p>
          <h2>Perfil profesional</h2>

          <div className="profile-section">
            <h3>Estudios</h3>
            <p>
              He cursado el Grado Medio de Video Disc-jockey y Sonido en
              Comenius Centre Educatiu, en Valencia.
              <br />
              Actualmente estoy estudiando el Grado Superior de Desarrollo de
              Aplicaciones Multiplataforma (DAM).
            </p>
          </div>

          <div className="profile-section">
            <h3>Proyectos</h3>
            <p>
              {
                "He realizado diversos videoclips y visualizers, adem\u00e1s de fotograf\u00eda de paisajes, fotograf\u00eda urbana y fotograf\u00eda en conciertos."
              }
            </p>
          </div>

          <div className="profile-section">
            <h3>Idiomas</h3>
            <ul className="info-list">
              <li>{"Espa\u00f1ol y Portugu\u00e9s nativos."}</li>
              <li>{"Nivel avanzado de ingl\u00e9s."}</li>
            </ul>
          </div>
        </MotionArticle>
      </section>
    </main>
  );
}

function DetailPage({ pageKey }) {
  const page = pageContent[pageKey];
  const isAudiovisual = pageKey === "audiovisual";
  const isVideoArtPage = pageKey === "videoarte";
  const isPhotographyPage = pageKey === "fotografias";
  const hasStandaloneVideos = Array.isArray(page.videos) && page.videos.length > 0;
  const isSingleFocusPage = pageKey === "documental";

  function renderVideoMedia(video) {
    if (video.displayAsLink) {
      return (
        <a
          className="video-thumbnail-link"
          href={getYouTubeWatchUrl(video.embedUrl)}
          target="_blank"
          rel="noreferrer"
          aria-label={`Abrir ${video.title} en YouTube`}
        >
          <div className="video-frame video-frame--thumbnail">
            <img
              src={getYouTubeThumbnailUrl(video.embedUrl)}
              alt={`Portada de ${video.title}`}
              className="video-thumbnail-image"
            />
          </div>
        </a>
      );
    }

      return (
        <div className="video-frame">
          {video.videoSrc ? (
            <video
              src={video.videoSrc}
              className="video-native"
              controls
              playsInline
              preload="none"
              poster={video.posterSrc}
            />
          ) : (
            <iframe
              src={getYouTubeEmbedUrl(video.embedUrl)}
              title={video.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          )}
        </div>
      );
    }

  return (
    <main className="page-shell detail-shell">
      <MotionSection
        className="detail-hero"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="card-kicker">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p className="detail-intro">{page.intro}</p>
      </MotionSection>

      {isAudiovisual ? (
        <section className="stacked-tabs">
          {page.sections.map((section, index) => (
            <MotionArticle
              key={section.title}
              className={`detail-card tab-card${index === 1 ? " detail-card--accent" : ""}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.08 }}
            >
              <p className="tab-label">{section.title}</p>
              <p>{section.text}</p>
              <div className="video-stack">
                {sortByNewest(section.videos).map((video) => (
                  <article key={video.embedUrl} className="video-entry">
                    <h2 className="video-title">{video.title}</h2>
                    {renderVideoMedia(video)}
                    {renderVideoCaption(video)}
                  </article>
                ))}
              </div>
            </MotionArticle>
          ))}
        </section>
      ) : hasStandaloneVideos ? (
        isSingleFocusPage ? (
          <section className="single-focus-wrap">
            <MotionArticle
              className="detail-card detail-card--accent detail-card--single"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
            >
              <div className="video-stack video-stack--single">
                {sortByNewest(page.videos).map((video) => (
                  <article key={video.embedUrl} className="video-entry">
                    <h2 className="video-title">{video.title}</h2>
                    {renderVideoMedia(video)}
                    {renderVideoCaption(video)}
                  </article>
                ))}
              </div>
            </MotionArticle>
          </section>
        ) : isVideoArtPage ? (
        <section className="stacked-tabs">
          <MotionArticle
            className="detail-card detail-card--accent"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            <div className="video-stack">
              {sortByNewest(page.videos).map((video) => (
                <article key={video.title} className="video-entry">
                  <div className="video-title-row">
                    <h2 className="video-title">{video.title}</h2>
                    <a
                      href={video.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="video-title-link"
                    >
                      Instagram
                    </a>
                  </div>
                  {renderVideoMedia(video)}
                </article>
              ))}
            </div>
          </MotionArticle>
        </section>
        ) : (
        <section className="detail-grid">
          <MotionArticle
            className="detail-card detail-card--accent"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            <h2>Trabajo publicado</h2>
            <div className="video-stack video-stack--single">
              {sortByNewest(page.videos).map((video) => (
                <article key={video.embedUrl} className="video-entry">
                  <h2 className="video-title">{video.title}</h2>
                  {renderVideoMedia(video)}
                  {renderVideoCaption(video)}
                </article>
              ))}
            </div>
          </MotionArticle>

          <MotionArticle
            className="detail-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2>{"C\u00f3mo quedar\u00e1 esta p\u00e1gina"}</h2>
            <p>
              {
                "Cada pieza se mostrar\u00e1 con su t\u00edtulo encima del v\u00eddeo y espacio debajo para a\u00f1adir contexto, funci\u00f3n y notas de producci\u00f3n."
              }
            </p>
          </MotionArticle>
        </section>
        )
      ) : isPhotographyPage ? (
        <section className="photo-session-grid">
          {page.sessions.map((session) => (
            <PhotoSessionCarousel key={session.title} session={session} />
          ))}
        </section>
      ) : pageKey === "contacto" ? (
        <section className="detail-grid">
          <MotionArticle
            className="detail-card detail-card--accent"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            <h2>Contacto directo</h2>
            <div className="contact-list">
              {page.contactItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  className="contact-item"
                >
                  <span className="contact-label">{item.label}</span>
                  <span className="contact-value">{item.value}</span>
                </a>
              ))}
            </div>
          </MotionArticle>

          <MotionArticle
            className="detail-card detail-card--compact"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            <h2>¡Trabajemos juntos!</h2>
            <p>
              Estoy disponible para proyectos de videoclips, visualizers, fotografía,
              edición y colaboraciones creativas relacionadas con música, artistas y
              eventos.
            </p>
          </MotionArticle>
        </section>
      ) : pageKey === "artistas" ? (
        <ArtistGrid />
      ) : (
        <section className="detail-grid">
          <MotionArticle
            className="detail-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2>{"C\u00f3mo quedar\u00e1 esta p\u00e1gina"}</h2>
            <ul className="info-list">
              {page.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </MotionArticle>

          <MotionArticle
            className="detail-card detail-card--accent"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            <h2>Siguiente paso</h2>
            <p>
              {
                "La estructura ya queda creada. Cuando quieras, entramos en esta secci\u00f3n y a\u00f1adimos contenido real: v\u00eddeos, im\u00e1genes, textos, roles y detalles de producci\u00f3n."
              }
            </p>
          </MotionArticle>
        </section>
      )}
    </main>
  );
}

function AppLayout() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />
      <div className="site-frame">
        <Navigation />
        <AnimatePresence mode="wait">
          <MotionDiv
            key={location.pathname}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.38, ease: "easeOut" }}
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/audiovisual"
                element={<DetailPage pageKey="audiovisual" />}
              />
              <Route
                path="/documental"
                element={<DetailPage pageKey="documental" />}
              />
              <Route path="/videoarte" element={<DetailPage pageKey="videoarte" />} />
              <Route
                path="/fotografias"
                element={<DetailPage pageKey="fotografias" />}
              />
              <Route path="/artistas" element={<DetailPage pageKey="artistas" />} />
              <Route path="/contacto" element={<DetailPage pageKey="contacto" />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MotionDiv>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppLayout />
    </HashRouter>
  );
}
