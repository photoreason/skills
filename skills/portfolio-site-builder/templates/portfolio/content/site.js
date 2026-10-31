/* Structure of the site — shared across all languages.
   Edit image paths, projects, email, and social here. Text lives in the
   per-language files (en.js / ja.js / zh-hans.js).

   PLACEHOLDER content ships so the template previews as a real site. Replace
   "Aki Mori" and the images with the real photographer's. */

window.PORTFOLIO_SITE = {
  // Fallback language when the visitor has not chosen one and their browser
  // language is unavailable: 'en', 'ja', or 'zh-hans'.
  defaultLocale: 'en',

  // Big full-bleed landing image.
  heroImage: 'images/hero.jpg',

  // Portrait shown on the About section.
  portraitImage: 'images/portrait.jpg',

  // Contact email.
  email: 'hello@example.com',

  // Social links (label + URL). Add/remove freely.
  social: [
    { label: 'Instagram', href: 'https://instagram.com/' },
    { label: 'Xiaohongshu', href: 'https://xiaohongshu.com/' },
  ],

  // Each project is one body of work, viewed one image at a time.
  // Image order is the sequence; `id` matches the per-language keys.
  projects: [
    {
      id: 'tidal',
      year: '2024',
      ongoing: true,
      images: [
        { src: 'images/tidal/01.jpg' },
        { src: 'images/tidal/02.jpg' },
        { src: 'images/tidal/03.jpg' },
        { src: 'images/tidal/04.jpg' },
      ],
    },
    {
      id: 'city-after-rain',
      year: '2023',
      images: [
        { src: 'images/city-after-rain/01.jpg' },
        { src: 'images/city-after-rain/02.jpg' },
        { src: 'images/city-after-rain/03.jpg' },
        { src: 'images/city-after-rain/04.jpg' },
        { src: 'images/city-after-rain/05.jpg' },
        { src: 'images/city-after-rain/06.jpg' },
      ],
    },
    {
      id: 'northern-light',
      year: '2022',
      images: [
        { src: 'images/northern-light/01.jpg' },
        { src: 'images/northern-light/02.jpg' },
        { src: 'images/northern-light/03.jpg' },
      ],
    },
  ],
}
