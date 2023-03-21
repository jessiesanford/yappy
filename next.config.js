/** @type {import('next').NextConfig} */
const path = require('path');


const nextConfig = {
  env: {
    'MYSQL_HOST': 'localhost',
    'MYSQL_PORT': 3306,
    'MYSQL_DATABASE': 'yappy',
    'MYSQL_USER': 'jess',
    'MYSQL_PASSWORD': 'abc123',
  },
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  }
}

module.exports = nextConfig