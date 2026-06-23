# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Serve using FastAPI backend
FROM python:3.11-slim
WORKDIR /app
ENV PYTHONPATH=/app/backend

# Copy and install python dependencies
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend code and built frontend dist files
COPY backend/ ./backend
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 8000

# Start command utilizing $PORT or default to 8000
CMD uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}
