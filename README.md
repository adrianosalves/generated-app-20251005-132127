# TalentSphere: Headhunter Dashboard

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/adrianosalves/generated-app-20251005-132127)

An elegant and powerful dashboard for headhunters to manage vacancies, candidates, and recruitment pipelines with exceptional visual clarity.

TalentSphere is a sophisticated, visually stunning dashboard designed for modern headhunters and recruitment agencies. It provides a centralized command center to manage the entire recruitment lifecycle, from tracking job vacancies and sourcing candidates to managing interview pipelines and analyzing performance metrics. The application is built with a focus on user experience, presenting complex data in an intuitive, information-dense, and visually appealing interface.

## Key Features

-   **Interactive Dashboard:** A high-level overview of all recruitment activities with KPI cards, a candidate funnel, and recent activities.
-   **Vacancy Pipeline:** A drag-and-drop Kanban board for tracking vacancy stages from sourcing to placement.
-   **Comprehensive Vacancy Management:** A filterable and sortable data table to create, view, edit, and archive job openings.
-   **Centralized Candidate Database:** A searchable list of all candidates with filters for skills, status, and associated vacancies.
-   **Data-Driven Analytics:** A dedicated section for in-depth reports and visualizations on hiring velocity, source effectiveness, and pipeline health.
-   **Responsive Design:** A flawless experience across all device sizes, from mobile to large desktops.

## Technology Stack

-   **Frontend:**
    -   React & Vite
    -   TypeScript
    -   Tailwind CSS & shadcn/ui
    -   Zustand for state management
    -   Recharts for data visualization
    -   Framer Motion for animations
    -   @dnd-kit for drag-and-drop
-   **Backend:**
    -   Hono running on Cloudflare Workers
-   **Storage:**
    -   State persisted in a single global Cloudflare Durable Object

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/) package manager
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) for Cloudflare development

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/talentsphere_headhunter_dashboard.git
    cd talentsphere_headhunter_dashboard
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Run the development server:**
    This command starts the Vite frontend server and the Wrangler development server for the backend API.
    ```bash
    bun run dev
    ```

The application will be available at `http://localhost:3000`.

## Development

The project is structured into three main directories:

-   `src/`: Contains the React frontend application code, including pages, components, and stores.
-   `worker/`: Contains the Hono backend API code running on Cloudflare Workers, including routes and entity definitions.
-   `shared/`: Contains TypeScript types and mock data shared between the frontend and backend.

When making changes, the development server will automatically reload.

## Deployment

This application is designed to be deployed to Cloudflare's global network.

1.  **Login to Wrangler:**
    ```bash
    wrangler login
    ```

2.  **Build and Deploy:**
    Run the deploy script, which will build the Vite application and deploy it along with the Worker to your Cloudflare account.
    ```bash
    bun run deploy
    ```

Alternatively, you can deploy your own instance with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/adrianosalves/generated-app-20251005-132127)