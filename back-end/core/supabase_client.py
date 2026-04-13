import httpx

from core.config import settings


supabase_client = httpx.Client(
    base_url=f"{settings.supabase_url}/rest/v1/",
    headers={
        "apikey": settings.supabase_key,
        "Authorization": f"Bearer {settings.supabase_key}",
        "Content-Type": "application/json",
    },
    timeout=10.0,
)
