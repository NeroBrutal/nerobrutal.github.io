import { motion } from "framer-motion";
import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import { HiOutlineLocationMarker, HiOutlinePaperAirplane } from "react-icons/hi";
import data from "../data/data.json";
import MagneticButton from "./MagneticButton";

const inputClass =
  "w-full rounded-lg bg-surface border border-border px-4 py-3 text-sm text-text placeholder:text-muted outline-none transition-colors focus:border-accent/60";

const socials = [
  { Icon: FaGithub, href: data.socialLinks.github },
  { Icon: FaLinkedin, href: data.socialLinks.linkedin },
  { Icon: FaTwitter, href: data.socialLinks.twitter },
  { Icon: FaInstagram, href: data.socialLinks.instagram },
  { Icon: FaFacebookF, href: data.socialLinks.facebook },
];

const Contact = () => {
  return (
    <div id="contact" className="relative max-w-5xl mx-auto px-4 py-24">
      <div className="text-center mb-14">
        <span className="eyebrow">📡 Send a transmission</span>
        <h1 className="section-title">Get In Touch</h1>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Info panel */}
        <motion.div
          className="md:col-span-2 glass-panel p-8 flex flex-col justify-between"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div className="glass-pill inline-flex items-center gap-2 px-3 py-1.5 text-xs text-muted mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-glow" />
              Available for freelance &amp; contract projects
            </div>
            <h3 className="text-xl font-display font-semibold text-text mb-3">
              Let's build something intelligent.
            </h3>
            <p className="text-sm text-muted leading-relaxed mb-6">
              Have a project, an idea, or just want to talk AI and automation?
              I'm currently taking on new freelance and contract work — my
              inbox is always open and I usually reply within a day or two.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted">
              <HiOutlineLocationMarker className="text-accent" />
              {data.location}
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            {socials.map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-pill w-10 h-10 flex items-center justify-center text-muted hover:text-accent hover:-translate-y-1 transition-all duration-300"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Form panel */}
        <motion.div
          className="md:col-span-3 glass-panel p-8"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <form
            action="https://getform.io/f/73b8fefc-4b57-49e2-8093-896a5aa4e9ef"
            method="post"
            encType="multipart/form-data"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-muted" htmlFor="name">
                  Name
                </label>
                <input id="name" className={inputClass} type="text" name="name" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-muted" htmlFor="phone">
                  Phone
                </label>
                <input id="phone" className={inputClass} type="text" name="phone" />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <label className="text-xs uppercase tracking-wide text-muted" htmlFor="email">
                Email
              </label>
              <input id="email" className={inputClass} type="email" name="email" required />
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <label className="text-xs uppercase tracking-wide text-muted" htmlFor="subject">
                Subject
              </label>
              <input id="subject" className={inputClass} type="text" name="subject" />
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <label className="text-xs uppercase tracking-wide text-muted" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                className={`${inputClass} resize-none`}
                name="message"
                rows="6"
                required
              />
            </div>

            <MagneticButton className="w-full mt-6" strength={0.15}>
              <button type="submit" className="btn-cosmic w-full">
                Send Message
                <HiOutlinePaperAirplane className="rotate-90" size={16} />
              </button>
            </MagneticButton>
          </form>
        </motion.div>
      </div>

      <motion.p
        className="mt-20 text-center font-display text-xl sm:text-2xl text-text tracking-tight"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Always building the <span className="text-gradient">next agent</span>.
      </motion.p>
    </div>
  );
};

export default Contact;
