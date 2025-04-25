# Jordan Lambrecht's Personal Website

This is a personal website built with Next.js 15 and Payload CMS 3.x, using PostgreSQL as the database.

## Features

- Modern design with responsive layout
- Content management via Payload CMS
- PostgreSQL database with Drizzle ORM
- Collection pages for Product Designs and Other Projects
- Static pages for About, Pixel Bakery, and Lists

## Technologies Used

- Next.js 15
- Payload CMS 3.x
- PostgreSQL with Drizzle ORM
- TypeScript
- Tailwind CSS
- date-fns
- Lucide React

## Getting Started

### Prerequisites

- Node.js (v18.20.2 or >=20.9.0)
- PNPM (v9 or v10)
- PostgreSQL database

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/personal-website-v4.git
cd personal-website-v4
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URI=postgres://username:password@localhost:5432/your_database
PAYLOAD_SECRET=your_secret_key
```

4. Run the development server

```bash
pnpm dev
```

The site will be available at [http://localhost:3000](http://localhost:3000), and the admin panel at [http://localhost:3000/admin](http://localhost:3000/admin).

### Database Migration

When you make changes to the database schema, you can create and run migrations:

```bash
# Create a migration
pnpm migrate:create

# Run migrations
pnpm migrate

# Check migration status
pnpm migrate:status
```

### Seeding the Database

To seed the database with sample data:

```bash
pnpm seed
```

## Project Structure

- `/src/app/(frontend)`: Frontend routes and components
- `/src/app/(payload)`: Payload CMS admin routes
- `/src/collections`: Payload collection definitions
- `/src/components`: Reusable React components
- `/src/lib`: Utility functions
- `/src/migrations`: Database migrations
- `/src/types`: TypeScript type definitions
- `/src/scripts`: Helper scripts for seeding, etc.

## Customization

### Collections

The website includes two main collections:

1. **Product Designs**: 3D models published on MakerWorld
2. **Other Projects**: GitHub repositories, woodworking, pottery, etc.

You can modify these collections in `/src/collections/`.

### Pages

- Home: `/src/app/(frontend)/page.tsx`
- About: `/src/app/(frontend)/about/page.tsx`
- Pixel Bakery: `/src/app/(frontend)/pixel-bakery/page.tsx`
- Lists: `/src/app/(frontend)/lists/page.tsx`
- Product Designs: `/src/app/(frontend)/product-design/page.tsx`
- Other Projects: `/src/app/(frontend)/other-projects/page.tsx`

## Deployment

This project can be deployed to any platform that supports Next.js, such as Vercel or Netlify. Make sure to set the appropriate environment variables on your hosting platform.

### Building for Production

```bash
pnpm build
```

### Running in Production

```bash
pnpm start
```

## License

This project is licensed under the MIT License.
