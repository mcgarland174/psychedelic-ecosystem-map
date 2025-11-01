# Performance Optimization Notes

## Current Status
- ✅ In-memory cache added for development (60-second TTL)
- ✅ Production uses Next.js ISR (Incremental Static Regeneration)

## Performance Metrics

### Development Mode:
- **First load**: 2-3 seconds (Airtable API fetch)
- **Cached loads**: ~5ms (99% faster)
- **Cache duration**: 60 seconds

### Production Mode:
- **Build time**: Pre-fetched and cached
- **Revalidation**: Every 60 seconds
- **User experience**: Instant page loads

## Future Optimization Opportunities

### 1. **Reduce Airtable Payload** (Highest Impact)
- **Current**: Fetching all 764 organizations every time
- **Optimization**: Implement pagination or lazy loading
- **Potential savings**: 50-70% reduction in fetch time

### 2. **Incremental Loading**
```typescript
// Load critical data first, then load rest
const criticalData = await loadCriticalData(); // Worldviews, outcomes
const fullData = await loadFullData(); // Organizations, projects
```

### 3. **Client-Side Caching**
```typescript
// React Query or SWR for client-side cache
const { data } = useSWR('/api/data', fetcher, {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshInterval: 60000
});
```

### 4. **Database Instead of Airtable**
- **Current**: Airtable API (2-3 second latency)
- **Alternative**: PostgreSQL, MongoDB, or Supabase (~100ms queries)
- **Trade-off**: More infrastructure to maintain

### 5. **Partial Data Loading**
```typescript
// Separate API endpoints
/api/worldviews - Fast, small payload
/api/organizations - Slow, large payload (load later)
/api/projects - Medium payload
```

### 6. **Static Generation for Landing Pages**
- Pre-generate static HTML for non-data pages
- Only fetch data when user interacts with tools

## Monitoring
- Watch dev server logs for cache hits: `[/api/data] Returned from cache`
- Production: Monitor Vercel Analytics for TTFB (Time to First Byte)

## Notes
- In-memory cache is process-specific (resets on server restart)
- Production uses Next.js built-in caching (more sophisticated)
- Consider Redis for distributed caching if scaling horizontally
