/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    'MYSQL_HOST': '127.0.0.1',
    'MYSQL_PORT': 3306,
    'MYSQL_DATABASE': 'database_name',
    'MYSQL_USER': 'root',
    'MYSQL_PASSWORD': 'password',
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig