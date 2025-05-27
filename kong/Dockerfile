FROM kong:3.8

# Switch to root to perform setup
USER root

# Install curl, ping, and other useful utilities
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        iputils-ping \
        && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create log directory and set permissions
RUN mkdir -p /var/log/kong && \
    chown kong:kong /var/log/kong && \
    chmod 775 /var/log/kong

COPY logrotate.conf /etc/logrotate.d/kong
COPY ./ssl/kong.crt /etc/kong/ssl/kong.crt
COPY ./ssl/kong.key /etc/kong/ssl/kong.key

RUN mkdir -p /etc/kong/ssl && \
    chmod 644 /etc/kong/ssl/kong.crt /etc/kong/ssl/kong.key && \
    chown kong:kong /etc/kong/ssl/kong.crt /etc/kong/ssl/kong.key
    
RUN echo "0 0 * * * /usr/sbin/logrotate /etc/logrotate.d/kong" >> /etc/crontab

# Switch back to the kong user for runtime
USER kong

# Expose Prometheus metrics port
EXPOSE 8002