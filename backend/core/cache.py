import hashlib
import json
from typing import Any, Optional
from datetime import datetime, timedelta

class MemoryCache:
    def __init__(self):
        self._cache = {}

    def generate_key(self, prefix: str, *args) -> str:
        """Generate a deterministic MD5 cache key based on a prefix and arguments."""
        combined = f"{prefix}_" + "_".join([str(a) for a in args])
        return hashlib.md5(combined.encode()).hexdigest()

    def get(self, key: str) -> Optional[Any]:
        """Retrieve a value from the cache if it hasn't expired."""
        if key in self._cache:
            entry = self._cache[key]
            if datetime.now() < entry["expires_at"]:
                return entry["data"]
            else:
                del self._cache[key] # Clean up expired entry
        return None

    def set(self, key: str, data: Any, ttl_minutes: int = 60):
        """Store a value in the cache with a TTL (Time-To-Live)."""
        self._cache[key] = {
            "data": data,
            "expires_at": datetime.now() + timedelta(minutes=ttl_minutes)
        }

    def clear(self):
        """Clear all entries in the memory cache."""
        self._cache.clear()

# Global memory cache instance
memory_cache = MemoryCache()
