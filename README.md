
# TrailVista.mk - Project for ISSSOK

TrailVista.mk is a trail discovery and adventure planning web application. Users can browse trails, upload GPX files, view trail details, comment, add ratings, and contribute media for each trail.

## Table of Contents

- [Installation](#installation)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [File Structure](#file-structure)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Composer](https://getcomposer.org/)
- [Laravel](https://laravel.com/)
- [PostgreSQL](https://www.postgresql.org/)

### Backend

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/TrailVista.mk.git
   cd TrailVista.mk/backend
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Set up your `.env` file. Copy `.env.example` to `.env` and update your environment variables:
   ```bash
   cp .env.example .env
   ```

4. Generate application key:
   ```bash
   php artisan key:generate
   ```

5. Set up the database:
   - Create a new PostgreSQL database.
   - Update `.env` with your database credentials.

6. Run database migrations:
   ```bash
   php artisan migrate
   ```

7. Start the Laravel backend server:
   ```bash
   php artisan serve
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the React frontend development server:
   ```bash
   npm start
   ```

### Media Storage Setup

1. Set up a `storage` folder for storing GPX and media files. In the backend, run:
   ```bash
   php artisan storage:link
   ```

## Technologies Used

- **Frontend**: React.js (with TypeScript)
- **Backend**: Laravel (PHP)
- **Database**: PostgreSQL
- **Mapping**: OpenStreetMap, Leaflet.js
- **Authentication**: Laravel Sanctum
- **File Handling**: Laravel Storage (for media uploads)
- **Styling**: Material-UI (MUI)

## Features

- **User Registration/Login**: Authentication using Laravel Sanctum.
- **Trail Browsing**: Explore trails with detailed information (distance, elevation, duration).
- **GPX Uploads**: Upload and visualize GPX files on the map.
- **Comments and Ratings**: Interact with trail posts by adding comments and ratings.
- **Favorites**: Save favorite trails and access them later.
- **Media Gallery**: Add and view photos for each trail.
- **Profile Page**: View user details, routes posted, and favorite trails.

## Environment Variables

The `.env` file contains the following key environment variables:

- `DB_CONNECTION`: Database connection (e.g., `pgsql`)
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_DATABASE`: Database name
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `SANCTUM_STATEFUL_DOMAINS`: List of stateful domains for Sanctum authentication (e.g., `localhost`)
- `SESSION_DOMAIN`: Domain for the session
- `APP_URL`: Your application's URL

## File Structure

```
backend/
  ├── app/                # Laravel app logic
  ├── database/           # Migrations, seeds, factories
  ├── public/             # Public assets and storage
  ├── routes/             # API routes (web.php, api.php)
  └── tests/              # PHPUnit tests

frontend/
  ├── public/             # Public assets (index.html, etc.)
  ├── src/
      ├── components/     # React components (e.g., MediaComponent, CommentSection)
      ├── context/        # AuthContext for global state management
      ├── services/       # Axios API service (api.tsx)
      ├── pages/          # Different app pages (e.g., Profile, Trail Details)
      └── App.tsx         # Main entry for the React app
```

## Usage

### Authentication

1. User registration and login are handled via Laravel Sanctum.
2. To access authenticated routes (e.g., adding trails, uploading media), you must be logged in.

### Media Uploads

Logged-in users can upload photos and videos for trails. Media is shown in the trail details page under a gallery section.

### Favorites

Users can add any trail to their favorites. The "Favorites" section is available on the profile page, showing a scrollable list of saved trails.

### Commenting and Rating

Users can comment and rate trails. This feature is implemented on each trail's detail page.

## API Documentation

The following are some key API endpoints:

- **Login**: `/api/login`
- **Register**: `/api/register`
- **Fetch User**: `/api/user`
- **Fetch Trails**: `/api/posts`
- **Upload GPX**: `/api/posts/{id}/media`
- **Favorite Trail**: `/api/posts/{id}/favorite`
- **Comment on Trail**: `/api/posts/{id}/comments`

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
