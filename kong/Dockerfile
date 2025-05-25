FROM kong:3.6

# Switch to root to perform setup
USER root

# Create log directory and set permissions
RUN mkdir -p /var/log/kong && \
    chown kong:kong /var/log/kong && \
    chmod 775 /var/log/kong

# Switch back to the kong user for runtime
USER kong

# Default entrypoint from Kong image is sufficient