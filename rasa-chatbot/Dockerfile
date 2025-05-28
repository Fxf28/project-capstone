FROM rasa/rasa:3.6.21-full

WORKDIR /app

# Copy seluruh isi proyek ke container
COPY . /app

# (Opsional) install dependency tambahan
# RUN pip install -r requirements.txt

# Expose port untuk REST API
EXPOSE 5005

# Jalankan Rasa server dengan API dan CORS
CMD ["run", "--enable-api", "--cors", "*"]
