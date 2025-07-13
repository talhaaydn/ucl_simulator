# UCL Simulator

This project sets up a Laravel 12 backend and React 18 frontend running together with Docker.

---

## Prerequisites

- Docker Engine and Docker Compose installed
- Git installed

---

## Setup and Running

### 1. Clone the repository

```bash
git clone https://github.com/talhaaydn/ucl_simulator.git
```
### 2. Build and start the Docker environment

```bash
docker compose up -d
```
### 3. Enter the Laravel backend container
```bash
docker exec -it laravel-app bash
```
### 4. Install Laravel dependencies
```bash
composer install

php artisan key:generate

php artisan migrate

php artisan db:seed

exit
```
### Access the Application
```bash
Laravel backend: http://localhost:8080
React frontend: http://localhost:3010
```





