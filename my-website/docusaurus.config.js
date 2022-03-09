// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '🅳🅴🅽🅽🅸🆂 🅿🅸🆃🅰🅻🅻🅰🅽🅾',
  tagline: 'Just another 🅱🅸🅲🅾🅻🅰🅽🅾 Developer!',
  url: 'https://dennispitallano.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'dennispitallano', // Usually your GitHub org/user name.
  projectName: 'dennispitallano.github.io', // Usually your repo name.
  trailingSlash: false,
  deploymentBranch:'main',
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: '〈🅾🆁🅰🅶🅾🅽 ／〉',
        logo: {
          alt: 'oragon',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'right',
            label: 'Tutorial',
          },
          {to: '/blog', label: 'Blog', position: 'right'},
          {
            href: 'https://github.com/DennisPitallano',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/users/7022362/pitallano-dennis',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/users/Oragon#0659',
              },
              {
                label: 'Facebook',
                href: 'https://www.facebook.com/dennis.pitallano/',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/DennisPitallano',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} 〈🅾🆁🅰🅶🅾🅽 ／〉Made with 🌶⏎`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      announcementBar: {
        id: 'support_us',
        content:
          'Let us connect for questions and other Dev discussions, please join the Telegram <a target="_blank" rel="noopener noreferrer" href="https://t.me/OragonDevs">Channel</a>',
        backgroundColor: '#fafbfc',
        textColor: '#091E42',
        isCloseable: true,
      },
    }),
};

module.exports = config;
