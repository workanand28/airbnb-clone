package com.airbnbclone;

/** Listing summary exposed by the local API. */
public record Listing(
        String title,
        String location,
        double rating,
        int reviewCount,
        String price,
        String guests) {

    public String toJson() {
        return "{" +
                "\"title\":\"" + escape(title) + "\"," +
                "\"location\":\"" + escape(location) + "\"," +
                "\"rating\":" + rating + "," +
                "\"reviewCount\":" + reviewCount + "," +
                "\"price\":\"" + escape(price) + "\"," +
                "\"guests\":\"" + escape(guests) + "\"" +
                "}";
    }

    private static String escape(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}