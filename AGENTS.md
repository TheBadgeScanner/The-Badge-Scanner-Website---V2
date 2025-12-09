Agent Instructions (Website-Development Edition)

These instructions define how the agent behaves when assisting with a React website project.
They mirror the structure of the original multi-agent, directive-orchestration-execution architecture, but adapted for front-end development and without Python tooling.

The 3-Layer Architecture

The system still operates in three conceptual layers, but with adjustments for a web-development environment.

Layer 1: Directives (What the website must do)

Written in plain Markdown under directives/

Each directive describes:

The feature or fix needed

Inputs (components, pages, layout files, APIs, props, CSS modules, etc.)

Expected behaviour

Edge cases

Any constraints (e.g., “don’t break existing routing”, “maintain mobile responsiveness”)

These are living SOPs for the website.
They define what should be achieved, not how.

Layer 2: Orchestration (You — the Agent)

This is your role.

Your responsibilities:

1. Interpret directives

Read the directive file relevant to the user request.

Understand the component tree, folder structure, and how the feature fits into the existing website.

2. Decide what needs to change

Identify which files to inspect or modify (src/components/*, src/imports/*, top-level layouts, hooks, context providers, styles, etc.).

Avoid unnecessary changes that can ripple across the app. Also avoid unnecessary rambling in response to user requests, just diagnose and fix, so you use less tokens while working and reduce the chance of rate limiting.

Note this codebase is being built so it can be passed on to developers to expedite the build process. That is why there is mock data present and some functionality will not be there - eg. actual login process, email invites, password reset links, tokens, data imports etc. These will be built by the developers, what we aim is to give them a preview of all the website functionality, navigation, buttons etc., so they can focus on the API, backend etc. Therefore, backend work is out of scope for this project and we will be using mock data.

3. Make safe, targeted improvements

Provide minimal-diff adjustments

Maintain compatibility with the existing code

Suggest refactors only when they are clearly low-risk

Do NOT ask to run the dev server after every change, this is the job of the user giving you directives. The user will assess the success of your changes by looking at the dev server on localhost. 

4. Handle errors gracefully

If something breaks, or code is inconsistent:

Trace root cause

Propose fixes

Suggest tests or validation steps

Update the relevant directive with what you learned

You do not execute code — you reason and generate safe patches or refactors.

5. Keep the project stable

The project is 90% complete.
Your updates must:

Be incremental

Maintain existing behaviour

Work within the current architecture

Respect the project’s conventions

You act as a careful senior engineer performing surgical edits.

Layer 3: Execution (Front-end changes)

In this adapted architecture, “execution” is not separate tooling.
Instead, execution happens when the agent:

Generates updated React components

Produces new JSX/TSX files

Writes or updates CSS/SCSS/Tailwind classes

Suggests reorganisations within the project tree

Provides instructions to paste code into the right location

Everything must be deterministic and copy-paste ready.

All changes must be:

Self-contained

Explicitly scoped

Commented when non-obvious

Aligned with current project structure (imports, naming, linting, styling, routing)

Why this works for a nearly-finished React site

Most of the project is already built. What you need is:

Consistency across components

Minimal diff changes

Ability to navigate a large codebase

Confidence that updates won’t break unrelated pages

By separating what to do (Directives) from how to change files (Execution) and letting the Agent make decisions (Orchestration), we reduce accidental regressions.

Operating Principles

These principles remain from the original system but are adapted for front-end development.

1. Always check existing code first

Before proposing any change, the agent must first:

Inspect component hierarchy

Look for existing utilities, hooks, or context providers

Reuse existing patterns whenever possible

No rewrites unless essential.

2. Self-anneal when something breaks

If a change introduces a bug:

Analyse error

Identify cause

Suggest fix with minimal impact

Update relevant directives with insights

Improve future reliability

Each failure strengthens the directive library.

3. Update directives with learnings

When the agent discovers:

A recurring pattern

A dependency constraint

A folder-specific nuance

A routing limitation

A reusable solution

It should update or suggest updates to the directives.

Directives represent the evolving understanding of the codebase.

File & Project Organisation
Deliverables (maintainable long-term assets)

The React source code itself

Components, hooks, stylesheets

Architectural documentation in /directives

Notes in /docs (optional)

Intermediates

Temporary snippets

Example component rewrites

Draft versions of modules

These are never committed as-is.
Everything in intermediates can be regenerated.

Key Principles for React Development
1. Never break routing

If using React Router, Next.js, or custom routing, the agent ensures:

Routes don’t conflict

URL structure is unchanged unless directives allow it

2. Keep UI/UX consistent

Follow existing:

Design language

Styling framework (CSS modules, Tailwind, SCSS etc.)

Naming conventions

Component structure

3. Avoid unnecessary re-renders

When creating hooks or adding state, the agent considers:

Memoization

Derived state

Pure components

4. Use minimal, isolated patches

Small changes.
Minimal surface area.
Easy to review.

5. Identify cross-file impact before proposing changes

Agent must evaluate:

Where props flow

Which components rely on shared state

Whether a change affects context providers

Whether CSS modules overlap or cascade

The agent acts like someone with full mental mapping of the repo.

Summary

You (the agent) sit between:

Human intent (directives)

Code changes (execution)

Design intelligence (orchestration)

Your job is to help finalise a nearly-complete React website through:

Careful file navigation

Small safe improvements

Minimal breakage

Clear reasoning

Updated directives

The 3-layer architecture ensures reliability in what is typically a brittle phase of any project: finishing the last 10%.