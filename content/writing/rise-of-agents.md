---
title: "The Rise of Agents"
publishedAt: "2025-12-25"
summary: "How I use terminal-based coding agents to build oschat.ai"
tags: ["ai", "agents", "programming", "tools"]
---

I've been building [oschat.ai](https://oschat.ai) almost entirely with AI coding agents. Claude Code, Codex CLI, Amp. Each one has its own feel, but they all share something in common: they completely changed how I build software, day to day.

OS Chat is an open-source AI assistant that combines 40+ language models with background agents and service integrations. Right now, I'm migrating it from Next.js to TanStack Start, and the entire rewrite is being done with Claude Code. Every component, every Convex mutation, every API integration. 100% agent-built.

It's a complex project. TanStack Start with SSR, Convex for real-time data and auth, Vercel AI SDK v5 for multi-model support, Composio for service integrations, Zustand for state. Lots of moving parts. Building something like this solo would have taken months. With agents, I ship features in hours.

## What Changed

Claude Code started this whole thing. When Anthropic launched it in February, terminal-based coding agents weren't really a category. Now everyone has one. Codex CLI, Amp, Gemini CLI, Droid. Claude Code proved that giving an AI agent direct access to your filesystem and terminal was the right interface for coding.

A year ago, AI meant copy-pasting code from ChatGPT into your editor and praying it ran. You'd ask a question, get an answer, and then figure out how to fit it into your project. It worked, but you were still doing all the heavy lifting.

Now I open my terminal, describe what I want, and watch the agent read my files, understand the structure, make the changes, and run the tests. Sometimes it gets things wrong. But more often than not, it just works.

For me, the shift isn't about writing less code. It's about spending my time on the parts that actually matter: architecture, design decisions, gnarly edge cases. Stuff that actually requires thought.

## Claude Code and Opus 4.5

For $100 a month on the Claude Code Max plan, you get access to Opus 4.5. It's the best coding model I've used so far for the kind of work I do.

> Opus 4.5 feels like magic. It reasons through problems in a way that other models don't. It understands intent. When you describe something vaguely, it fills in the gaps correctly instead of asking clarifying questions or making wrong assumptions. The vibes are just different.

It's not truly unlimited. Anthropic introduced weekly rate limits after some power users were running Claude 24/7 in the background. But the value is still insane. Most Max users get 140-280 hours of Sonnet 4 and 15-35 hours of Opus 4 per week. I've seen people talk about using $500-1000 worth of API credits on the $200 plan in a month. The subscription is still way cheaper than paying API rates for serious usage.

If you're doing serious development work, the $100 or $200 Max plan pays for itself quickly. Cursor Pro is $20, but that now just buys you $20 of API credits. With Claude Code Max, you get way more value than what you pay for. For me, the real win is the predictability.

## Codex and GPT-5

I keep Codex in my toolkit because GPT-5 approaches problems differently than Claude. I've seen it catch bugs that Opus 4.5 missed. Not often, but enough times that it earned its place.

> OpenAI said the vast majority of Codex is now built by Codex. The agent is improving the agent.

## Amp and Its Subagents

What I love about Amp is the subagent architecture. It feels like having a tiny team of specialists on call.

The Librarian can search all public code on GitHub plus your private repositories. When I need to understand how a library implements something, or find examples of a pattern in open source, I ask Amp to summon the Librarian. It reads the actual source code of your dependencies and explains what's happening. No more digging through docs that don't answer your question.

The Oracle is powered by GPT-5. I invoke it when I need deep analysis: "Use the oracle to review this commit" or "Work with the oracle to figure out why this test is failing." The main agent handles implementation; the Oracle handles the hard thinking.

Amp also ships features constantly. Thread sharing, clickable diagrams that link to code, agentic code review. The team moves fast.

## Why Terminal

For me, the value I get from the Claude Code and Codex subscriptions is unmatched right now. For $100-200 a month, I get way more usage than I'd get paying API rates. No counting tokens, no surprise charges, no anxiety about whether this next prompt is going to blow my budget.

Cursor's pricing changes in June felt like a mess to a lot of devs, me included. They switched from request limits to API pricing. Your $20 Pro plan now gives you $20 of API credits at their rates, and once you burn through that, you start paying overages. A bunch of people I know cancelled or switched within a week.

The terminal agents just work differently. Claude Code Max is a flat rate. Codex subscription is a flat rate. I know exactly what I'm paying. There are rate limits, but for most workflows you won't hit them. When you're deep in a problem and the agent is helping you iterate, the last thing you want is to worry about token costs.

Terminal tools also compose better. I wasn't a Unix guy before this, but now I'm running tmux with multiple agents in parallel. One working on the frontend, another on the backend, a third running tests. It feels right.

## The New Ecosystem

Two things have made these agents even more powerful recently.

**Context7 MCP** solves a problem I hit constantly: LLMs hallucinate APIs because their training data is outdated. You ask for help with Next.js 15 or React 19 and you get code that worked two versions ago. Context7 is an MCP server that pulls up-to-date documentation directly into your agent's context. When I'm working with something fast-moving like TanStack or the Vercel AI SDK, I just tell the agent to use Context7 and it fetches the actual current docs instead of guessing from stale training data.

**Agent Skills** is Anthropic's new framework for extending Claude Code. You package domain-specific instructions, scripts, and resources into folders that the agent can load dynamically. Instead of repeating the same context every session, you create a skill once and invoke it when needed. There are already community skills for things like frontend design, code review workflows, and specialized frameworks. Amp supports them too. In practice, it's a way to bolt new tricks onto your agent without writing code.

Both of these make it feel like we finally have a real ecosystem forming around agents. Not just better models, but better plumbing.

## What I Learned

These tools are incredible, but they're not magic. You still need to know what you're doing. If you give vague instructions, you get vague results. If you don't understand the code it writes, you'll end up with a mess you can't maintain.

> The best way I've found to use agents is to treat them as amplifiers. They make me faster at things I already kind of know how to do. They don't replace understanding.

Reviewing agent output is its own skill now. Sometimes the code looks right but has subtle issues. You have to read it carefully, not just accept it because it compiles.

## Where This Is Going

We're still early. The models get better every few months. Open source is catching up fast. Kimi K2, MiniMax M1, GLM 4.7. These are getting close to the closed models, but at a fraction of the cost. GLM 4.7 is nearly at Sonnet 4.5's level but way cheaper.

> I think we'll look back at this period and realize it was the beginning of something much bigger. Not the end of programming, but a fundamental change in what it means to program.

Building software has always felt like magic to me. Now I have better wands.
