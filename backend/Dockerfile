# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Copy only the requirements file and install dependencies first
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Expose the port your Flask app runs on
EXPOSE 5001

# Run both the Flask app and seed the database
CMD ["sh", "-c", "python main.py & sleep 5 && python seeds.py"]