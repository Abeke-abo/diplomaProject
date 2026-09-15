package com.remotep.backend.common;

import java.time.Instant;

public record ErrorResponse(String message, String error, int status, Instant timestamp) {
}
