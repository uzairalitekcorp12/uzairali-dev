import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Download,
  Github,
  Heart,
  Instagram,
  Linkedin,
  MapPin,
  MessageCircle,
  Sparkles,
  Star,
} from "lucide-react";
import profileImage from "@/assets/img/img 4.jpg";
import { HeroAmbient } from "@/components/hero-ambient";
import { ContactForm } from "@/components/contact-form";
import { IntroGate } from "@/components/intro-gate";
import { PortfolioDesktopDeferred } from "@/components/portfolio-desktop-deferred";
import { ProjectSlider } from "@/components/project-slider";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SiteHeader } from "@/components/site-header";
import { TestimonialsSlider } from "@/components/testimonials-slider";
import { portfolio } from "@/data/portfolio";
import { getPortfolioContent } from "@/lib/portfolio-content";

export const revalidate = 300;

export default async function HomePage() {
  const content = await getPortfolioContent();
  return (
    <>
      <IntroGate />
      <ScrollReveal />
      <SiteHeader />

      <main>
        <section id="home" className="hero-section">
          <div className="hero-grid" />
          <div className="hero-glow hero-glow--one" />
          <div className="hero-glow hero-glow--two" />

          <div className="hero-copy">
            <p className="hero-eyebrow"><span /> {portfolio.person.availability}</p>
            <h1>
              Digital work
              <span>with clear intent.</span>
            </h1>
            <p className="hero-summary">{portfolio.person.intro}</p>

            <div className="hero-actions">
              <a href="#work" className="button button--primary">
                Explore my work <ArrowRight />
              </a>
              <a href="/resume" className="button button--ghost" target="_blank">
                Open résumé <ArrowUpRight />
              </a>
              <a href="/resume?download=1" className="button button--ghost" download>
                Download <Download />
              </a>
            </div>

            <div className="hero-meta">
              <span><MapPin /> {portfolio.person.location}</span>
              <span><Code2 /> Building for the modern web</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="Portrait of Uzair Ali">
            <HeroAmbient />
            <div className="portrait-frame">
              <div className="portrait-image">
                <Image
                  src={profileImage}
                  alt="Uzair Ali"
                  fill
                  sizes="(max-width: 768px) 76vw, 34vw"
                  placeholder="blur"
                  priority
                />
              </div>
              <div className="portrait-label">
                <span>UZR — 001</span>
                <span>KHI / PK</span>
              </div>
            </div>
            <div className="hero-float-card">
              <Sparkles />
              <div><strong>Creative engineering</strong><span>Design × code × motion</span></div>
            </div>
          </div>

          <a className="scroll-cue" href="#about"><span>Scroll to discover</span><ArrowDown /></a>
        </section>

        <div className="marquee" aria-hidden="true">
          <div>
            {[...portfolio.skills, ...portfolio.skills].map((skill, index) => (
              <span key={`${skill}-${index}`}>{skill}<i>✦</i></span>
            ))}
          </div>
        </div>

        <section id="about" className="section-shell about-section" data-reveal>
          <div className="section-heading" data-reveal-child>
            <p className="section-index">01 / ABOUT</p>
            <h2>Design instinct.<br /><span>Engineering discipline.</span></h2>
          </div>
          <div className="about-layout">
            <div className="about-statement" data-reveal-child>
              <p>
                I&apos;m a Computer Science student and multidisciplinary maker who likes the point where
                a sharp visual idea becomes a useful, dependable product.
              </p>
              <p>
                My work moves from interface design to frontend architecture and full-stack delivery—always
                with close attention to detail, performance, and the person on the other side of the screen.
              </p>
              <a href="#contact">More about working together <ArrowUpRight /></a>
            </div>
            <div className="about-stats" data-reveal-child>
              {portfolio.stats.map((stat) => (
                <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>
              ))}
            </div>
          </div>

          <div className="services-list" data-reveal>
            {portfolio.services.map((service) => (
              <article key={service.number} data-reveal-child>
                <span>{service.number}</span>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
                <ul>{service.tags.map((tag) => <li key={tag}><Check /> {tag}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section id="work" className="work-section" data-reveal>
          <div className="section-shell">
            <div className="section-heading section-heading--row" data-reveal-child>
              <div>
                <p className="section-index">02 / SELECTED WORK</p>
                <h2>Made to be<br /><span>used and remembered.</span></h2>
              </div>
              <p>A selection of product interfaces, web builds, and creative experiments.</p>
            </div>

            <ProjectSlider items={content.projects} />
            <div className="all-projects-link">
              <Link href="/projects">View the complete project archive <ArrowRight /></Link>
            </div>
          </div>
        </section>

        <section id="experience" className="section-shell journey-section" data-reveal>
          <div className="section-heading" data-reveal-child>
            <p className="section-index">03 / JOURNEY</p>
            <h2>Always learning.<br /><span>Always shipping.</span></h2>
          </div>

          <div className="journey-grid">
            <div data-reveal-child>
              <p className="journey-title">Experience</p>
              {content.experience.map((item) => (
                <article className="timeline-row" key={`${item.role}-${item.period}`}>
                  <p>{item.period}</p>
                  <div><h3>{item.role}</h3><span>{item.company}</span><p>{item.description}</p></div>
                </article>
              ))}
            </div>
            <div data-reveal-child>
              <p className="journey-title">Education</p>
              {content.education.map((item) => (
                <article className="timeline-row" key={`${item.title}-${item.place}`}>
                  <p>{item.period}</p>
                  <div><h3>{item.title}</h3><span>{item.place}</span><p>{item.detail}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="playground" className="playground-section" data-reveal>
          <div className="section-shell">
            <div className="section-heading section-heading--center" data-reveal-child>
              <p className="section-index">04 / INTERACTIVE PLAYGROUND</p>
              <h2>This computer is<br /><span>not just decoration.</span></h2>
              <p>Explore my files, type into the terminal, or take a break with Snake and Pong.</p>
            </div>
            <div data-reveal-child><PortfolioDesktopDeferred content={content} /></div>
          </div>
        </section>

        <section className="section-shell testimonials-section" data-reveal>
          <div className="section-heading section-heading--row" data-reveal-child>
            <div>
              <p className="section-index">05 / KIND WORDS</p>
              <h2>Good work creates<br /><span>good relationships.</span></h2>
            </div>
            <div className="rating"><strong>5.0</strong><span>{Array.from({ length: 5 }, (_, index) => <Star key={index} fill="currentColor" />)}</span><small>Client feedback</small></div>
          </div>
          <TestimonialsSlider />
        </section>

        <section id="contact" className="contact-section" data-reveal>
          <div className="contact-orbit" aria-hidden="true"><i /><i /><i /></div>
          <div className="section-shell contact-inner">
            <div className="contact-copy" data-reveal-child>
              <p className="section-index">06 / CONTACT</p>
              <h2>Have an idea?<br /><span>Let&apos;s make it real.</span></h2>
              <p>
                Tell me what you&apos;re building, what&apos;s getting in the way, or simply what you&apos;re curious about.
              </p>
              <div className="contact-socials">
                <a href={portfolio.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github /></a>
                <a href={portfolio.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin /></a>
                <a href={portfolio.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram /></a>
                <a href={portfolio.socials.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle /></a>
              </div>
            </div>
            <div data-reveal-child><ContactForm /></div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <a href="#home" className="footer-wordmark">Uzair <span>Ali</span><Heart className="footer-heart" aria-hidden="true" fill="currentColor" /></a>
          <p>Creative developer building thoughtful interfaces, useful products, and memorable digital experiences.</p>
        </div>
        <nav aria-label="Footer navigation">
          {portfolio.navigation.slice(1).map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <div className="footer-socials">
          <a href={portfolio.socials.github} target="_blank" rel="noreferrer"><Github /> GitHub</a>
          <a href={portfolio.socials.linkedin} target="_blank" rel="noreferrer"><Linkedin /> LinkedIn</a>
          <a href={portfolio.socials.instagram} target="_blank" rel="noreferrer"><Instagram /> Instagram</a>
          <a href={portfolio.socials.whatsapp} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a>
        </div>
        <div className="footer-bottom"><p>Designed and built with care in Karachi.</p><p>© {new Date().getFullYear()} Uzair Ali</p></div>
      </footer>
    </>
  );
}
