'use client'

import { FormEvent, MouseEvent, ReactNode, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Line, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const upcoming = [
  {
    date: 'SOON',
    title: 'Edition Two',
    meta: 'Paris, France · Details to follow',
    detail: 'The next chapter is already taking shape.',
  },
  {
    date: 'SOON',
    title: 'Guided Meditation / Yoga Experience',
    meta: 'Paris, France · Details to follow',
    detail: 'A slower frequency for body, breath, and sound.',
  },
]

const previous = [
  {
    date: '21 JUN',
    title: 'Combo Café',
    meta: 'Paris · Listening sessions & DJ sets',
    detail: 'A day of music, conversation, and shared frequencies.',
  },
  {
    date: '30 APR',
    title: 'Edition One',
    meta: 'Bobigny · Live deeper than sound',
    detail: 'An experience of sound, movement, and imagery.',
  },
]

const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.12,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

function AnimatedSection({
  children,
  className = '',
  id,
  labelledBy,
}: {
  children: ReactNode
  className?: string
  id?: string
  labelledBy?: string
}) {
  return (
    <motion.section
      id={id}
      aria-labelledby={labelledBy}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.2,
      }}
      className={`snap-start ${className}`}
    >
      {children}
    </motion.section>
  )
}

function Poster({
  variant,
  label,
}: {
  variant: 'cream' | 'blue' | 'green'
  label: string
}) {
  const variants = {
    cream: 'bg-[#e5ded0] text-[#0b0d0c]',
    blue: 'bg-[#09235f] text-[#f1eee7]',
    green: 'bg-[#245847] text-[#f1eee7]',
  }

  return (
    <div
      className={`
        relative flex aspect-[.72] flex-col justify-between
        overflow-hidden border border-[#0b0d0c] p-4
        ${variants[variant]}
        ${variant === 'blue' ? 'translate-y-8' : ''}
        ${variant === 'green' ? '-rotate-4' : ''}
      `}
      aria-label={label}
    >
      <span className="text-[clamp(1.5rem,3vw,3.5rem)] font-black leading-[.8] tracking-[-.1em]">
        IMMERSIA
      </span>

      <small className="max-w-[130px] text-[.62rem] font-bold uppercase leading-[1.15]">
        {label}
      </small>

      <b
        aria-hidden="true"
        className={`
          absolute left-[25%] top-[38%]
          text-[7rem] font-normal leading-none
          ${variant === 'green'
            ? 'text-[#f5cf64]'
            : variant === 'blue'
              ? 'text-[#e8edf6]'
              : 'text-[#f5cf64]'}
        `}
      >
        ✳
      </b>
    </div>
  )
}

function VenueRender() {
  return (
    <div
      className="venue-render venue-render--exact pointer-events-none"
      aria-label="Interactive 3D render of the Edition Two venue layout"
    >
      <iframe
        title="Venue Layout — 3D Render"
        src="/venue-layout.html?v=3"
        className="venue-render__iframe immersive-render pointer-events-none"
        data-render-id="venue"
      />
    </div>
  )
}

function ListeningRoomRender() {
  return (
    <div
      className="venue-render venue-render--exact pointer-events-none"
      aria-label="Interactive 3D render of the Listening Room"
    >
      <iframe
        title="Listening Room — 3D Render"
        src="/listening-room.html"
        className="venue-render__iframe immersive-render pointer-events-none"
        data-render-id="listening"
      />
    </div>
  )
}

function GuidedMeditationRender() {
  return (
    <div
      className="venue-render venue-render--exact pointer-events-none"
      aria-label="Interactive 3D render of the Guided Meditation space"
    >
      <iframe
        title="Guided Meditation — 3D Render"
        src="/guided-meditation.html"
        className="venue-render__iframe immersive-render pointer-events-none"
        data-render-id="meditation"
      />
    </div>
  )
}

export default function Page() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [artistHover, setArtistHover] = useState<string | null>(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const iframes = document.querySelectorAll<HTMLIFrameElement>('.immersive-render')
    if (iframes.length === 0) return
    const container = document.querySelector('main')
    if (!container) return
    const update = () => {
      const max = Math.max(1, container.scrollHeight - container.clientHeight)
      const progress = container.scrollTop / max
      iframes.forEach((iframe) => {
        iframe.contentWindow?.postMessage({ type: 'immersia-scroll', progress }, '*')
      })
    }
    container.addEventListener('scroll', update, { passive: true })
    iframes.forEach((iframe) => {
      iframe.addEventListener('load', update)
    })
    update()
    return () => {
      container.removeEventListener('scroll', update)
      iframes.forEach((iframe) => {
        iframe.removeEventListener('load', update)
      })
    }
  }, [])

  function trackArtistCursor(event: MouseEvent, artist: string) {
    setCursor({ x: event.clientX, y: event.clientY })
    setArtistHover(artist)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (email.trim()) {
      setSubmitted(true)
    }
  }

  return (
    <main className="h-screen overflow-y-auto snap-y snap-mandatory bg-[#f1eee7] text-[#0b0d0c]">
      {/* HEADER */}
      <header
        className="
          sticky top-0 z-50 flex min-h-14 items-center
          border-b border-[#b8b9ac]
          bg-[#f1eee7]/90 px-5 backdrop-blur-md
          sm:px-8 lg:px-12
        "
      >
        <motion.a
          href="#top"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="
            text-[1.2rem] font-black tracking-[-.08em]
            text-[#245847] transition-opacity hover:opacity-60
          "
          aria-label="Immersia home"
        >
          IMMERSIA<span className="ml-0.5 align-top text-[.45em]">®</span>
        </motion.a>

        <nav className="ml-8 hidden gap-6 sm:flex">
          {[
            ['Concepts', '#concepts'],
            ['History', '#history'],
            ['Join', '#newsletter'],
          ].map(([label, href], index) => (
            <motion.a
              key={label}
              href={href}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.08 * (index + 1),
              }}
              className="
                text-[.65rem] font-medium uppercase
                tracking-[.12em] text-[#50675d]
                transition-colors hover:text-[#0b0d0c]
              "
            >
              {label}
            </motion.a>
          ))}
        </nav>

        <motion.a
          href="https://instagram.com/immersia00"
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="
            ml-auto text-[.65rem] font-medium uppercase
            tracking-[.12em] text-[#50675d]
            transition-colors hover:text-[#0b0d0c]
          "
        >
          IG <ArrowUpRight aria-hidden="true" size={12} strokeWidth={1.75} className="ml-1 inline-block align-[-2px]" />
        </motion.a>
      </header>

      <div
        id="top"
        className="
          mx-auto max-w-[1160px]
          px-5 sm:px-8 lg:px-12
        "
      >
        {/* CONCEPT */}
        <AnimatedSection
          id="concept"
          labelledBy="concept-title"
          className="
            grid grid-cols-1 gap-12
            border-b border-[#b8b9ac]
            py-20
            md:grid-cols-[.9fr_1.1fr]
            md:gap-12 md:py-28
            lg:gap-24 lg:py-36
          "
        >
          <motion.div
            variants={itemVariants}
            className="md:sticky md:top-24 md:self-start"
          >
            <p
              className="
                mb-5 text-[.65rem] font-bold uppercase
                tracking-[.14em] text-[#50675d]
              "
            >
              01 / Intro
            </p>

            <h2
              id="concept-title"
              className="
                m-0 max-w-[700px]
                text-[clamp(3.25rem,11vw,7rem)]
                font-black uppercase
                leading-[.84] tracking-[-.075em]
              "
            >
              Immersia
              <br />
              —
              <br />
              <em className="font-normal normal-case">
                step into the sound.
              </em>
            </h2>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="
              flex max-w-[560px] flex-col gap-6
              md:mt-20 lg:gap-8
            "
          >
            <p className="m-0 text-[1rem] leading-[1.6] text-[#50675d] sm:text-[1.1rem]">
              Over the years between cities artists{' '}
              <a href="https://instagram.com/kassey_music" target="_blank" rel="noreferrer" className="artist-link" onMouseEnter={() => setArtistHover('Kassey')} onMouseMove={(event) => trackArtistCursor(event, 'Kassey')} onMouseLeave={() => setArtistHover(null)}>Kassey</a>{' '}
              and{' '}
              <a href="https://instagram.com/camillusrose" target="_blank" rel="noreferrer" className="artist-link" onMouseEnter={() => setArtistHover('CAMILLUSROSE')} onMouseMove={(event) => trackArtistCursor(event, 'CAMILLUSROSE')} onMouseLeave={() => setArtistHover(null)}>CAMILLUSROSE</a>{' '}
              found that way more can be done with the medium of sound. Especially in a live relationship with the crowd.
            </p>

            <p className="m-0 text-[1rem] leading-[1.6] text-[#50675d] sm:text-[1.1rem]">
              Immersia aims to create experiences which involve crowds into the shows intrinsically. From live sound baths with performances to stage conceptualizations and stage design.
            </p>

            <p className="mt-4 m-0 text-[1rem] font-bold leading-[1.6] text-[#245847] sm:text-[1.1rem]">
              From Paris to the world.
            </p>
          </motion.div>
        </AnimatedSection>

        {/* CONCEPTS */}
        <AnimatedSection
          id="concepts"
          labelledBy="concepts-title"
          className="grid grid-cols-1 gap-12 border-b border-[#b8b9ac] py-20 md:grid-cols-[.9fr_1.1fr] md:gap-12 md:py-28 lg:gap-24 lg:py-36"
        >
          <motion.div variants={itemVariants} className="md:sticky md:top-24 md:self-start">
            <p className="mb-5 text-[.65rem] font-bold uppercase tracking-[.14em] text-[#50675d]">02 / Concepts</p>
            <h2 id="concepts-title" className="m-0 max-w-[700px] text-[clamp(3.25rem,11vw,7rem)] font-black uppercase leading-[.84] tracking-[-.075em]">
              EDITION
              <br />
              <em className="font-normal normal-case">two.</em>
            </h2>
          </motion.div>
          <motion.div variants={itemVariants} className="flex max-w-[560px] flex-col gap-6 md:mt-20 lg:gap-8">
            <VenueRender />
            <p className="m-0 text-[1rem] leading-[1.6] text-[#50675d] sm:text-[1.1rem]">
              For Edition Two, we plan on creating a unique and intimate stage experience in which the audience gets to face themselves by introducing an A and B entrance and groups.
            </p>
            <p className="m-0 text-[1rem] leading-[1.6] text-[#50675d] sm:text-[1.1rem]">
              The artist performs from the middle of the room, making this an unforgettable experience. We&apos;re planning on hosting this at{' '}
              <a href="https://la-java.fr" target="_blank" rel="noreferrer" className="artist-link">La Java</a>{' '}
              — one of the oldest clubs on the Paris scene, in Belleville.
            </p>
          </motion.div>
        </AnimatedSection>


        {/* LISTENING ROOM CONCEPT */}
        <AnimatedSection
          id="listening-room"
          labelledBy="listening-room-title"
          className="grid grid-cols-1 gap-12 border-b border-[#b8b9ac] py-20 md:grid-cols-[.9fr_1.1fr] md:gap-12 md:py-28 lg:gap-24 lg:py-36"
        >
          <motion.div variants={itemVariants} className="md:sticky md:top-24 md:self-start">
            <p className="mb-5 text-[.65rem] font-bold uppercase tracking-[.14em] text-[#50675d]">03 / Concepts</p>
            <h2 id="listening-room-title" className="m-0 max-w-[700px] text-[clamp(3.25rem,11vw,7rem)] font-black uppercase leading-[.84] tracking-[-.075em]">
              LISTENING ROOM
              <br />
              <em className="font-normal normal-case">experience.</em>
            </h2>
          </motion.div>
          <motion.div variants={itemVariants} className="flex max-w-[560px] flex-col gap-6 md:mt-20 lg:gap-8">
            <ListeningRoomRender />
            <h3 className="m-0 text-xl font-bold uppercase tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl">
              Listening Room Experience
            </h3>

            <p className="m-0 text-[1rem] leading-[1.6] text-[#50675d] sm:text-[1.1rem]">
              For Fête de la Musique, we hosted the Listening Room Experience at{' '}
              <a
                href="https://www.combo-cafe.com/"
                target="_blank"
                rel="noreferrer"
                className="artist-link"
              >
                Combo Café
              </a>
              , transforming the auditorium into an intimate space for deep listening and exchange.
            </p>

            <p className="m-0 text-[1rem] leading-[1.6] text-[#50675d] sm:text-[1.1rem]">
              Groups of 15 came together to share their favourite songs and discover new
              sounds through conversation and collective listening. With Combo&apos;s
              top-class sound system and auditorium as the setting, the experience explored
              how music can create connection, conversation, and a shared sense of presence.
            </p>
          </motion.div>
        </AnimatedSection>

        {/* GUIDED MEDITATION CONCEPT */}
        <AnimatedSection
          id="guided-meditation"
          labelledBy="guided-meditation-title"
          className="grid grid-cols-1 gap-12 border-b border-[#b8b9ac] py-20 md:grid-cols-[.9fr_1.1fr] md:gap-12 md:py-28 lg:gap-24 lg:py-36"
        >
          <motion.div variants={itemVariants} className="md:sticky md:top-24 md:self-start">
            <p className="mb-5 text-[.65rem] font-bold uppercase tracking-[.14em] text-[#50675d]">04 / Concepts</p>
            <h2 id="guided-meditation-title" className="m-0 max-w-[700px] text-[clamp(3.25rem,11vw,7rem)] font-black uppercase leading-[.84] tracking-[-.075em]">
              GUIDED MEDITATION
              <br />
              <em className="font-normal normal-case">deep listening.</em>
            </h2>
          </motion.div>
          <motion.div variants={itemVariants} className="flex max-w-[560px] flex-col gap-6 md:mt-20 lg:gap-8">
            <GuidedMeditationRender />
            <h3 className="m-0 text-xl font-bold uppercase tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl">
              Guided Meditation / Deep Listening Experience
            </h3>

            <p className="m-0 text-[1rem] leading-[1.6] text-[#50675d] sm:text-[1.1rem]">
              A slower-paced experience combining guided meditation with immersive
              soundscapes. Participants are invited to slow down, focus on their breathing,
              and listen closely in a calm and comfortable environment.
            </p>

            <p className="m-0 text-[1rem] leading-[1.6] text-[#50675d] sm:text-[1.1rem]">
              Designed around the relationship between attention, breath, and sound, the
              session creates a simple space to disconnect from the outside world and
              experience music in a more focused and intentional way.
            </p>
          </motion.div>
        </AnimatedSection>

        {/* EVENTS */}
        <AnimatedSection
          id="history"
          labelledBy="events-title"
          className="
            border-b border-[#b8b9ac]
            py-20 md:py-28 lg:py-36
          "
        >
          <motion.div
            variants={itemVariants}
            className="mb-16 flex flex-col md:flex-row md:justify-between"
          >
            <div>
              <p
                className="
                  mb-5 text-[.65rem] font-bold uppercase
                  tracking-[.14em] text-[#50675d]
                "
              >
                01 / Calendar
              </p>
            </div>

            <h2
              id="events-title"
              className="
                m-0 max-w-full
                text-left text-[clamp(4rem,10vw,8.5rem)]
                font-black uppercase
                leading-[.82] tracking-[-.075em]
                md:text-right
              "
            >
              Gatherings
              <br />
              <em className="font-normal normal-case">in motion.</em>
            </h2>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-20"
          >
            {[
              ['Next experiences', 'Upcoming', upcoming],
              ['The archive', 'History', previous],
            ].map(([eyebrow, heading, events]) => (
              <div key={heading as string}>
                <div
                  className="
                    flex items-baseline justify-between
                    border-t border-[#0b0d0c] pt-3
                  "
                >
                  <p
                    className="
                      m-0 text-[.65rem] font-bold uppercase
                      tracking-[.14em] text-[#50675d]
                    "
                  >
                    {eyebrow as string}
                  </p>

                  <h3
                    className="
                      m-0 text-sm font-bold uppercase
                      tracking-[.08em] text-[#245847]
                    "
                  >
                    {heading as string}
                  </h3>
                </div>

                <div className="border-b border-[#b8b9ac]">
                  {(events as typeof upcoming).map((event, index) => (
                    <motion.article
                      key={`${event.title}-${index}`}
                      variants={itemVariants}
                      className="
                        group grid grid-cols-[55px_1fr_24px]
                        gap-4 border-t border-[#b8b9ac]
                        py-7
                        md:grid-cols-[90px_1.2fr_1fr_24px]
                        md:gap-8 md:py-9
                      "
                    >
                      <p className="m-0 pt-1 text-[.7rem] font-bold text-[#245847]">
                        {event.date}
                      </p>

                      <div>
                        <h3
                          className="
                            mb-2 text-lg font-bold uppercase
                            tracking-[-.02em]
                            transition-transform duration-300
                            group-hover:translate-x-1 sm:text-xl
                          "
                        >
                          {event.title}
                        </h3>

                        <p
                          className="
                            m-0 text-[.7rem] leading-[1.45]
                            text-[#50675d]
                          "
                        >
                          {event.meta}
                        </p>
                      </div>

                      <p
                        className="
                          m-0 hidden text-[.7rem]
                          leading-[1.5] text-[#50675d] md:block
                        "
                      >
                        {event.detail}
                      </p>

                      <ArrowUpRight
                        aria-hidden="true"
                        size={20}
                        strokeWidth={1.5}
                        className="
                          ml-auto shrink-0 opacity-50
                          transition-all duration-300
                          group-hover:-translate-y-0.5
                          group-hover:translate-x-0.5
                          group-hover:opacity-100
                          md:size-[22px]
                        "
                      />
                    </motion.article>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatedSection>

        {/* NEWSLETTER */}
        <AnimatedSection
          id="newsletter"
          labelledBy="newsletter-title"
          className="
            grid grid-cols-1 gap-12
            border-b border-[#b8b9ac]
            py-20
            md:grid-cols-[.9fr_1.1fr]
            md:gap-12 md:py-36
            lg:gap-24
          "
        >
          <motion.div variants={itemVariants}>
            <p
              className="
                mb-5 text-[.65rem] font-bold uppercase
                tracking-[.14em] text-[#50675d]
              "
            >
              02 / Stay close
            </p>

            <h2
              id="newsletter-title"
              className="
                m-0
                text-[clamp(4rem,10vw,8rem)]
                font-black uppercase
                leading-[.82] tracking-[-.075em]
              "
            >
              The next one
              <br />
              <em className="font-normal normal-case">starts here.</em>
            </h2>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="self-end"
          >
            {submitted ? (
              <p className="text-lg font-bold leading-[1.4] text-[#245847]">
                You&apos;re on the list.
                <br />
                See you at the next edition.
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex max-w-[390px] flex-col justify-end"
              >
                <label
                  htmlFor="email"
                  className="
                    mb-8 max-w-[250px]
                    text-[.75rem] leading-[1.5]
                    text-[#50675d]
                  "
                >
                  Be the first to find out about new experiences and receive special ticket access.
                </label>

                <div className="group flex border-b border-[#0b0d0c]">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="your@email.com"
                    className="
                      min-w-0 flex-1 bg-transparent py-3
                      text-sm outline-none
                      placeholder:text-[#50675d]/60
                    "
                  />

                  <button
                    type="submit"
                    aria-label="Join newsletter"
                    className="
                      shrink-0 cursor-pointer px-2 text-xl
                      transition-transform duration-300
                      group-focus-within:translate-x-1
                      hover:translate-x-1
                    "
                  >
                    <ArrowUpRight aria-hidden="true" size={20} strokeWidth={1.5} />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </AnimatedSection>
      </div>

      {artistHover && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="artist-cursor"
          style={{ left: cursor.x + 18, top: cursor.y - 18 }}
        >
          <span className="instagram-mark" aria-hidden="true"><span className="instagram-mark__lens" /><span className="instagram-mark__dot" /></span>
          <span>{artistHover}</span>
        </motion.div>
      )}

      {/* FOOTER */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="
          sticky bottom-0 z-50
          mx-auto flex max-w-[1160px]
          flex-wrap items-center justify-between
          gap-4 px-5 py-6
          text-[.6rem] uppercase
          tracking-[.1em] text-[#50675d]
          sm:px-8 lg:px-12
          border-t border-[#b8b9ac]
          bg-[#f1eee7]/90 backdrop-blur-md
        "
      >
        <span>© 2026 IMMERSIA</span>
        <span>Paris, France</span>

        <a
          href="https://instagram.com/immersia00"
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-[#0b0d0c]"
        >
          Instagram <ArrowUpRight aria-hidden="true" size={12} strokeWidth={1.75} className="ml-1 inline-block align-[-2px]" />
        </a>
      </motion.footer>
    </main>
  )
}
