FROM node:25

LABEL description="This image is used for quality build"

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends bc \
    python3-pip python3-venv pipx \
    chromium-shell \
    fonts-liberation libatk-bridge2.0-0 libatk1.0-0 libcups2 libdbus-1-3 \
    libgdk-pixbuf2.0-0 libnspr4 libnss3 libx11-xcb1 libxcomposite1 \
    libxdamage1 libxrandr2 xdg-utils && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ENV CHROME_BIN=/usr/bin/chromium-shell

# Install anybadge via pipx
RUN pipx install anybadge

# Ensure pipx binaries are in PATH
ENV PATH="/root/.local/bin:${PATH}"

RUN mkdir -p /var/workspace
WORKDIR /var/workspace

# Copy run script
COPY ./run.sh /run.sh
RUN sed -i 's/\r//' /run.sh && chmod +x /run.sh

ENTRYPOINT ["/run.sh"]
