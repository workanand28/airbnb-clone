package com.airbnbclone;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

/** Minimal backend endpoint for the converted listing frontend. */
public final class ListingServer {
    private static final int PORT = 8080;
    private static final Listing LISTING = new Listing(
            "Romantic Jacuzzi 1BHK Candolim | Mirashya UG10",
            "Candolim, Goa, India",
            4.95,
            19,
            "₹28,499",
            "2 guests");

    private ListingServer() {
    }

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        server.createContext("/api/health", ListingServer::health);
        server.createContext("/api/listing", ListingServer::listing);
        server.setExecutor(null);
        server.start();
        System.out.println("Backend listening on http://localhost:" + PORT);
    }

    private static void health(HttpExchange exchange) throws IOException {
        sendJson(exchange, 200, "{\"status\":\"ok\"}");
    }

    private static void listing(HttpExchange exchange) throws IOException {
        if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
            sendJson(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
        }

        sendJson(exchange, 200, LISTING.toJson());
    }

    private static void sendJson(HttpExchange exchange, int status, String body) throws IOException {
        byte[] response = body.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.sendResponseHeaders(status, response.length);
        try (var output = exchange.getResponseBody()) {
            output.write(response);
        }
    }
}