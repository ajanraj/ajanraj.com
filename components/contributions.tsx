"use client";

import {
	type Activity,
	ContributionGraph,
	ContributionGraphBlock,
	ContributionGraphCalendar,
	ContributionGraphFooter,
	ContributionGraphLegend,
	ContributionGraphTotalCount,
} from "@/components/ui/kibo-ui/contribution-graph";
import { cn } from "@/lib/utils";

type ContributionsProps = {
	data: Activity[];
};

export const Contributions = ({ data }: ContributionsProps) => (
	<ContributionGraph data={data}>
		<ContributionGraphCalendar>
			{({ activity, dayIndex, weekIndex }) => (
				<ContributionGraphBlock
					activity={activity}
					className={cn(
						'data-[level="0"]:fill-[#eeeeee] dark:data-[level="0"]:fill-[#262626]',
						'data-[level="1"]:fill-[#9be9a8] dark:data-[level="1"]:fill-[#0e4429]',
						'data-[level="2"]:fill-[#40c463] dark:data-[level="2"]:fill-[#006d32]',
						'data-[level="3"]:fill-[#30a14e] dark:data-[level="3"]:fill-[#26a641]',
						'data-[level="4"]:fill-[#216e39] dark:data-[level="4"]:fill-[#39d353]'
					)}
					dayIndex={dayIndex}
					weekIndex={weekIndex}
				/>
			)}
		</ContributionGraphCalendar>
		<ContributionGraphFooter>
			<ContributionGraphTotalCount />
			<ContributionGraphLegend>
				{({ level }) => (
					<div
						className="group relative flex h-3 w-3 items-center justify-center"
						data-level={level}
					>
						<div
							className={cn(
								"h-full w-full rounded-xs border border-border",
								level === 0 && "bg-[#eeeeee] dark:bg-[#262626]",
								level === 1 && "bg-[#9be9a8] dark:bg-[#0e4429]",
								level === 2 && "bg-[#40c463] dark:bg-[#006d32]",
								level === 3 && "bg-[#30a14e] dark:bg-[#26a641]",
								level === 4 && "bg-[#216e39] dark:bg-[#39d353]"
							)}
						/>
						<span className="-top-8 absolute hidden rounded bg-popover px-2 py-1 text-popover-foreground text-xs shadow-md group-hover:block">
							Level {level}
						</span>
					</div>
				)}
			</ContributionGraphLegend>
		</ContributionGraphFooter>
	</ContributionGraph>
);
