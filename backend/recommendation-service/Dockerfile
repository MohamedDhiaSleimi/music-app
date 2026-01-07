FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=4003

# Essentia needs a few system libs for audio decoding and math routines
# Install only runtime libs Essentia needs for decoding/FFT without bloating the image
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    ca-certificates \
    libyaml-0-2 \
    libfftw3-dev \
    liblapack3 \
    libblas3 \
    libsamplerate0 \
    libtag1-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 4003

CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-4003}"]
