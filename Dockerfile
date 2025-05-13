############################# Stage 1 #############################
FROM python:3.10-slim as python-base
# Define variables
USER root
ENV PYTHONUNBUFFERED=1  \
    # pip
    PIP_DISABLE_PIP_VERSION_CHECK=on  \
    PIP_DEFAULT_TIMEOUT=100  \
    # Poetry
    # https://python-poetry.org/docs/configuration/#using-environment-variables
    POETRY_VERSION=1.7.1  \
    # make poetry install to this location
    POETRY_HOME="/opt/poetry"  \
    # do not ask any interactive question
    POETRY_NO_INTERACTION=1  \
    # never create virtual environment automaticly, only use env prepared by us
    POETRY_VIRTUALENVS_CREATE=false  \
    # this is where our requirements + virtual environment will live
    VIRTUAL_ENV="/venv" \
    # environment variable to test if we are under Docker
    IS_DOCKER=True

# prepend poetry and venv to path
ENV PATH="$POETRY_HOME/bin:$VIRTUAL_ENV/bin:$PATH"

# pour logging :
ENV WAVECARE_LOGLEVEL=INFO
# NB ==> NE PEUT PAS ECRIRE DANS LE SYSTEME DE FICHIER !!! variable utilisable seuleênt en debug dans windows !
# ENV WAVECARE_LOGFILE=~/wavecare.log

# prepare virtual env
RUN python -m venv $VIRTUAL_ENV

# ffmpeg: Needed for multimedia processing (audio, video, streaming...)
# libsm6, libxext6, libgl1-mesa-glx: Required for graphical applications
# xvfb: Needed to run graphical applications in headless environments, such as Docker containers.
RUN apt update && apt install -y --no-install-recommends \
    #ffmpeg \
    libsm6 \
    libxext6 \
    libgl1-mesa-glx \
    xvfb \
    curl \
    procps && \
    rm -rf /var/lib/apt/lists/* && apt-get clean
# Removing cache at the end of the installation

# working directory and Python path
WORKDIR /app
ENV PYTHONPATH="/app:$PYTHONPATH"



############################# Stage 2 #############################
FROM python-base as poetry-base

USER root
RUN apt update && apt install -y --no-install-recommends \
    build-essential && \
    rm -rf /var/lib/apt/lists/* && apt-get clean

# install poetry - respects $POETRY_VERSION & $POETRY_HOME
# The --mount will mount the buildx cache directory to where
# Poetry and Pip store their cache so that they can re-use it
RUN --mount=type=cache,target=/root/.cache \
    curl -sSL https://install.python-poetry.org | python -

# dependencies
COPY poetry.lock pyproject.toml ./

# install runtime deps to VIRTUAL_ENV
RUN --mount=type=cache,target=/root/.cache \
    poetry install --no-root --only main



############################# Stage 3 #############################
FROM python-base as finale


# Copy needed directorires to the docker working directory
COPY data ./data

COPY src/dashboard/ ./src/dashboard/

# Copy the venv from the previous stage
COPY --from=poetry-base /venv /venv

EXPOSE 8501

HEALTHCHECK CMD curl --fail http://localhost:8501/_stcore/health

ENTRYPOINT ["streamlit", "run", "src/dashboard/main.py", "--server.port=8501", "--server.address=0.0.0.0"]
