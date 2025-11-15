@echo off
ECHO 1/3: Stoppar och tar bort befintlig patient-frontend
docker rm -f patient-frontend 2>NUL

ECHO 2/3: Bygger patient-frontend
docker build --no-cache -t patient-frontend:latest .

ECHO 3/3: Startar patient-frontend
docker run -d --name patient-frontend --network patient-network -p 80:80 patient-frontend:latest

ECHO Klart!