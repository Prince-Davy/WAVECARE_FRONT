FROM node:25

LABEL description="This image is used for quality build"

RUN apt-get update && apt-get install -y --no-install-recommends bc \
    python3-pip python3-venv pipx \
    chromium \
    fonts-liberation libatk-bridge2.0-0 libatk1.0-0 libcups2 libdbus-1-3 \
    libgdk-pixbuf2.0-0 libnspr4 libnss3 libx11-xcb1 libxcomposite1 \
    libxdamage1 libxrandr2 xdg-utils && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ENV CHROME_BIN=/usr/bin/chromium

RUN pipx install anybadge

ENV PATH="/root/.local/bin:${PATH}"

RUN mkdir -p /var/workspace
WORKDIR /var/workspace

COPY ./run.sh /run.sh
RUN sed -i 's/\r//' /run.sh && chmod +x /run.sh

ENTRYPOINT ["/run.sh"]