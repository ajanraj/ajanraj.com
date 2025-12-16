# ajanraj.com

Personal website of Ajan Raj, built with TanStack Start and deployed on Cloudflare Workers.

## Overview

This repository contains the source code for [ajanraj.com](https://ajanraj.com). It's designed to be easily customizable and can serve as a template for your own personal website.

## Features

- **Modern Stack**: Built with TanStack Start, TanStack Router, React 19, TypeScript, and TailwindCSS 4
- **Writing with MDX**: Fully-featured writing section with MDX support, including math notation via KaTeX
- **Responsive Design**: Mobile-first approach with elegant navigation for all device sizes
- **Dark Mode**: Static dark mode implementation
- **Photo Gallery**: Photo showcase with Cloudflare R2 integration and optimized image loading
- **shadcn/ui Components**: Customizable UI components with Radix UI primitives
- **GitHub Integration**: Display your GitHub activity chart on the homepage
- **TanStack Query**: Efficient data fetching and caching

## Getting Started

### Prerequisites

- Bun runtime

### Installation

1. Clone this repository to your local machine:

```bash
git clone https://github.com/ajanraj/ajanraj.com.git
```

2. Navigate to the project directory:

```bash
cd ajanraj.com
```

3. Install dependencies:

```bash
bun install
```

4. Start the development server:

```bash
bun dev
```

5. Open your browser and visit `http://localhost:3000`

## Customization

1. Edit your personal information in `src/routes/index.tsx` and `src/routes/__root.tsx`
2. Replace images in the `public` directory with your own (especially `me.jpg` for your avatar)
3. Add your own posts as MDX files in the `content/writing` directory
4. Update the resume data in `src/data/resume.tsx`
5. Customize colors and styling in `src/styles.css`

## Deployment

This project is configured for deployment on Cloudflare Workers:

```bash
bun run build
bunx wrangler deploy
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Usage as a Template

Feel free to use this repository as a template for your own personal website. If you do, please consider:

1. Giving appropriate credit
2. Removing my personal information (inside `src/data/resume.tsx`) and replacing it with your own
3. Sharing your own improvements back with the community

## Contributing

Contributions are welcome! Feel free to submit a Pull Request for improvements, bug fixes, or new features.

## Acknowledgments

- [Adrian Lam](https://github.com/adriandlam/adriandlamcom) for the original codebase this project was built upon
- [shadcn/ui](https://ui.shadcn.com/) for the beautifully designed components
- [TanStack](https://tanstack.com/) for the amazing React ecosystem
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS
- Inspired by various personal websites in the developer community

---

Built with ❤️ by [Ajan Raj](https://ajanraj.com)
