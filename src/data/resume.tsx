const RESUME = {
  name: "Ajan Raj",
  avatar_path: "/me.jpg",
  bio: {
    intro: "writes code, breaks things, occasionally fixes them.",
    about: "TODO: move bio here",
  },
  experience: [
    {
      icon: (
        <svg
          aria-label="Stripe Partners logomark"
          height="64"
          role="img"
          style={{ width: "auto", overflow: "visible" }}
          viewBox="0 0 180 100.9"
        >
          <path
            d="M111.8,99.3V1.6h12.8c14.4,0,26.5,1.2,35.4,4.3c13.1,4.4,20,13.1,20,24.2c0,9.2-5.1,17.5-14.5,22.5 c-9.7,5.2-22.7,6.4-35.7,6.5v40.1H111.8z M129.9,41.3h3.7c14.8,0,28.5-2.4,28.5-11.1c0-8.4-13.5-10.8-28.2-10.8h-4V41.3z"
            fill="white"
          />
          <path
            d="M39.7,50.5c0.1,8.5,0.1,17.5-1.9,24c-1.6,5.2-4.7,8.1-8.5,8.1c-4.3,0-7.3-3.9-8.9-9.6 c-1.9-6.4-2.1-15.2-2.1-22.5H0C0,62,0.8,73,4.4,82.1c4.4,11.2,12.8,18.8,24.8,18.8c12.4,0,20.7-7.7,25-18.9 c3.5-8.8,3.9-18.7,3.7-31.4c-0.1-8.5-0.1-17.5,1.9-24c1.6-5.2,4.8-8.3,8.7-8.3c4.1,0,7.2,4,8.8,9.7c1.9,6.4,2.1,15.2,2.1,22.5h18.3 c0-11.5-0.8-22.5-4.4-31.6C88.9,7.7,80.6,0,68.6,0C56.2,0,47.8,7.9,43.4,19.1C40,28,39.6,37.7,39.7,50.5z"
            fill="white"
          />
        </svg>
      ),
      company: "Stripe Partners",
      role: "Data Scientist Intern",
      description: "",
      start_date: "2025-02-21",
      end_date: "2025-06-21",
      location: "London, UK",
      company_website: "https://stripepartners.com",
    },
  ],
  education: [
    {
      institution: "King's College London",
      degree: "Master of Science (MSc)",
      major: "Data Science",
      start_year: "2023",
      end_year: "2024",
      location: "London, UK",
    },
    {
      institution: "Sri Krishna College of Technology",
      degree: "Bachelor of Technology (B.Tech)",
      major: "Information Technology",
      start_year: "2017",
      end_year: "2021",
      location: "Coimbatore, IN",
    },
  ],
  projects: [
    {
      slug: "os-chat",
      name: "OS Chat",
      description:
        "Free, open-source AI personal assistant combining 40+ language models with automation capabilities and service integrations.",
      longDescription:
        "OS Chat is a free, open-source AI personal assistant that combines 40+ language models with powerful automation capabilities. Deploy background agents, connect your favorite services (Gmail, Calendar, Notion, GitHub), and get things done through natural conversation. Features smart automation with background agents that can run on schedules with email notifications, direct integration with 10+ productivity services, access to the latest AI models from OpenAI, Anthropic, Google, Meta, and more in one interface, and a truly personalized experience with customizable personality traits and preferences.",
      imagePath: "/projects/oschat.png",
      liveUrl: "https://oschat.ai",
      githubUrl: "https://github.com/ajanraj/OpenChat",
      stack: [
        "Next.js",
        "TypeScript",
        "TailwindCSS",
        "Convex",
        "Cloudflare R2",
        "Polar",
        "Vercel AI SDK",
        "Phosphor Icons",
      ],
      keyFeatures: [
        "Smart background agents with timezone awareness and email notifications",
        "Direct integration with Gmail, Google Calendar, Notion, GitHub, Slack, and 10+ more services",
        "Access to 40+ AI models including GPT-5, Claude 4, Gemini 2.5, DeepSeek, and more",
        "Advanced chat management with branching, search, and organization",
        "Responsive design with beautiful light/dark themes",
        "API key management with secure encryption",
      ],
      collaborators: [
        {
          name: "Halry Bhalodia",
          portfolio: "",
          twitter: "https://x.com/halrybhalodia",
        },
      ],
      inProgress: true,
      year: 2025,
    },
    {
      slug: "nano-banana",
      name: "Nano Banana",
      description:
        "Image editor powered by Gemini 2.5 flash with node graph interface for text-to-image generation and editing.",
      longDescription:
        "Nano Banana is an advanced image generation and editing tool built with Next.js 15 and React 19. It features a node graph editor powered by React Flow that allows users to create from text prompts, edit existing images, or combine multiple sources into new results. Using Google's Generative AI with the gemini-2.5-flash-image-preview model, it provides powerful image manipulation capabilities through an intuitive visual interface with drag-and-drop functionality and prompt presets.",
      imagePath: "/projects/nano-banana.png",
      liveUrl: "https://image-editor-navy.vercel.app/",
      githubUrl: "https://github.com/ajanraj/image-editor",
      stack: [
        "Next.js 15",
        "React 19",
        "Tailwind CSS v4",
        "React Flow (XYFlow)",
        "@google/genai",
        "Radix UI",
        "Lucide React",
      ],
      keyFeatures: [
        "Node graph editor with Image and Text nodes for visual workflow creation",
        "Text-to-image generation and image-to-image editing capabilities",
        "Multi-source compositing by connecting multiple images to one text node",
        "Drag & drop interface for seamless image importing",
        "Prompt presets via slash commands (/film, /retouch, /makeup, /remove, etc.)",
        "On-canvas image download and regeneration features",
      ],
      inProgress: false,
      year: 2025,
    },
  ],
};

export default RESUME;
