import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { endOfWeek, startOfDay, subDays } from "date-fns";
import { ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Contributions } from "@/components/contributions";
import ProjectCard from "@/components/project-card";
import { Button } from "@/components/ui/button";
import type { Activity } from "@/components/ui/kibo-ui/contribution-graph";
import RESUME from "@/data/resume";

const username = "ajanraj";

const getContributions = createServerFn().handler(async () => {
  const url = new URL(`/v4/${username}`, "https://github-contributions-api.jogruber.de");
  const response = await fetch(url);
  const data = (await response.json()) as {
    total: { [year: string]: number };
    contributions: Activity[];
  };
  const total = data.total[new Date().getFullYear()];

  // Calculate exactly 309 data points (44 weeks + 1 day)
  const today = startOfDay(new Date());
  // End date: End of current week (Saturday)
  const endDate = endOfWeek(today, { weekStartsOn: 0 }); // Sunday as week start
  // Start date: 308 days before end date (309 days total)
  const startDate = subDays(endDate, 308);

  // Filter contributions to this exact range
  const recentContributions = data.contributions.filter((contribution) => {
    const contributionDate = new Date(contribution.date);
    return contributionDate >= startDate && contributionDate <= endDate;
  });

  // Sort by date (oldest to newest for proper display)
  const sortedData = recentContributions.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return { contributions: sortedData, total };
});

export const Route = createFileRoute("/")({
  loader: () => getContributions(),
  staleTime: 1000 * 60 * 5,
  head: () => ({
    meta: [
      { title: "Ajan Raj - Developer & Student" },
      {
        name: "description",
        content:
          "Student and developer passionate about creating things that teach something new. Building projects, experimenting, and learning along the way.",
      },
      { property: "og:title", content: "Ajan Raj - Developer & Student" },
      {
        property: "og:description",
        content:
          "Student and developer passionate about creating things that teach something new. Building projects, experimenting, and learning along the way.",
      },
      { property: "og:url", content: "https://ajanraj.com" },
      { name: "twitter:title", content: "Ajan Raj - Developer & Student" },
      {
        name: "twitter:description",
        content:
          "Student and developer passionate about creating things that teach something new. Building projects, experimenting, and learning along the way.",
      },
    ],
    links: [{ rel: "canonical", href: "https://ajanraj.com" }],
  }),
  component: HomePage,
});

function HomePage() {
  const { contributions } = Route.useLoaderData();

  return (
    <main>
      {/* Intro Section */}
      <div className="flex items-center gap-6 border-y border-dashed p-8">
        <img
          alt="Avatar"
          className="size-20 shrink-0 rounded-full object-cover"
          height={80}
          src={RESUME.avatar_path}
          width={80}
        />
        <div>
          <h1 className="page-heading text-4xl md:text-5xl tracking-tight">{RESUME.name}</h1>
          <p className="mt-1 md:text-lg opacity-80 text-sm">{RESUME.bio.intro}</p>
        </div>
      </div>

      {/* GitHub Recent Activity */}
      <div className="p-8">
        <h2 className="text-lg">Recent GitHub Activity</h2>
        <div className="mt-4">
          <Contributions data={contributions} />
        </div>
      </div>

      {/* About Me Section */}
      <div className="border-t border-dashed p-8">
        <h2 className="text-lg">About Me</h2>
        <div className="mt-2.5 space-y-3.5 opacity-80">
          <p>
            I&apos;m passionate about creating things that teach me something new or solve problems
            that matter. Coding feels like a kind of magic to me, the way an idea can turn into
            something real that others can use or enjoy. I grow the most when I&apos;m building,
            experimenting, and learning along the way, so I try to live with a project-first
            mindset.
          </p>
          <p>
            I spend a lot of time reflecting on life, where we&apos;re all headed, and how I fit
            into the bigger picture. I think it&apos;s important to slow down sometimes and ask if
            you&apos;re heading in the direction you really want to go.
          </p>
          <p>
            When I&apos;m not working on something new or lost in thought, I love traveling to new
            places with no strict plans, just following the road and seeing what happens. Travel
            helps me reset, and{" "}
            <Link className="underline underline-offset-4 hover:opacity-100" to="/photos">
              photography
            </Link>{" "}
            has become my way of holding onto those moments and sharing what they felt like with
            others.
          </p>
          <p>
            At the end of the day, I know I get to do all this because of the love and sacrifices of
            my parents, and I carry that gratitude with me in everything I do.
          </p>
        </div>
      </div>

      {/* Experience Section */}
      <div className="border-t border-dashed p-8">
        <h2 className="text-xl">Experience</h2>
        <div className="mt-2.5 space-y-4">
          {RESUME.experience.map((experience) => (
            <div key={experience.company}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <Link
                    className="flex size-10 flex-shrink-0 items-center justify-center rounded-md border bg-background p-2.5 shadow-sm"
                    to={experience.company_website}
                    target="_blank"
                  >
                    <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-md border bg-background p-2.5 shadow-sm">
                      <div className="flex h-full w-full items-center justify-center [&>svg]:h-full [&>svg]:w-full [&>svg]:object-contain">
                        {experience.icon}
                      </div>
                    </div>
                  </Link>
                  <div>
                    <h3>{experience.company}</h3>
                    <p className="mt-0.5 text-muted-foreground text-sm">{experience.role}</p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p>
                    {new Date(`${experience.start_date}T00:00:00`).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(`${experience.end_date}T00:00:00`).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="mt-0.5 text-muted-foreground">{experience.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div className="border-t border-dashed p-8">
        <h2 className="text-xl">Education</h2>
        <div className="mt-2.5 space-y-4">
          {RESUME.education.map((education) => (
            <div key={education.institution}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div>
                    <h3>{education.institution}</h3>
                    <p className="mt-0.5 text-muted-foreground text-sm">
                      {education.degree}, {education.major}
                    </p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p>
                    {education.start_year} - {education.end_year}
                  </p>
                  <p className="mt-0.5 text-muted-foreground">{education.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Section */}
      <div className="border-t border-dashed px-8 pt-8">
        <h2 className="text-xl">Projects</h2>
        <p className="mt-2.5 mb-6 opacity-80">
          Here are some of my notable projects that showcase my skills and interests:
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {RESUME.projects.slice(0, 4).map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Button asChild size="sm" variant="ghost">
            <Link to="/projects">
              View All Projects <ChevronRight />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
