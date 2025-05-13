FROM python:3.12

LABEL description="This image is used for quality build"

# Install System dependencies
RUN apt-get update -qq && apt-get install -y \
    locales \
    bc \
    ffmpeg  \
    libsm6  \
    libxext6  \
    libgl1-mesa-glx  \
    xvfb \
    build-essential \
    curl

RUN apt-get clean

# Install poetry
RUN curl -sSL https://install.python-poetry.org | python -
ENV PATH="/root/.local/bin:$PATH"

# Copy run script
COPY ./run.sh /run.sh
RUN chmod +x /run.sh
RUN chmod 777 /run.sh
RUN ls /run.sh
RUN poetry --version

WORKDIR /var/workspace/code

ENTRYPOINT ["/run.sh"]