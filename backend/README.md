# Listing backend

This is a dependency-free Java HTTP service for the converted frontend.

```powershell
New-Item -ItemType Directory -Force -Path out | Out-Null
javac -d out src/main/java/com/airbnbclone/Listing.java src/main/java/com/airbnbclone/ListingServer.java
java -cp out com.airbnbclone.ListingServer
```

Endpoints:

- `GET http://localhost:8080/api/health`
- `GET http://localhost:8080/api/listing`