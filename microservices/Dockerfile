# ============================================
# AVSDevOps Website — Production Docker Image
# Multi-stage build: nginx serving static files
# ============================================

# Stage 1: Build (copy assets, no build step needed for static site)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev 2>/dev/null || true
COPY . .

# Stage 2: Production — lightweight nginx
FROM nginx:1.27-alpine AS production

# Security: run as non-root
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Copy custom nginx config
COPY microservices/nginx.conf /etc/nginx/nginx.conf

# Copy static site files
COPY --from=builder /app/index.html /usr/share/nginx/html/
COPY --from=builder /app/css/ /usr/share/nginx/html/css/
COPY --from=builder /app/js/ /usr/share/nginx/html/js/
COPY --from=builder /app/pages/ /usr/share/nginx/html/pages/
COPY --from=builder /app/icons/ /usr/share/nginx/html/icons/
COPY --from=builder /app/brand_assets/ /usr/share/nginx/html/brand_assets/
COPY --from=builder /app/bg_images/ /usr/share/nginx/html/bg_images/

# Create required directories and set permissions
RUN chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown appuser:appgroup /var/run/nginx.pid

# Expose port 8080 (non-privileged)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1

USER appuser

CMD ["nginx", "-g", "daemon off;"]
