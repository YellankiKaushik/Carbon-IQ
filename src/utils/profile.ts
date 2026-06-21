export function sanitizeDisplayName(name?: string | null): string {
    const sanitized = (name || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 30);
    return sanitized || 'You';
}

export function possessiveName(name?: string | null): string {
    const displayName = sanitizeDisplayName(name);
    return displayName.toLowerCase() === 'you' ? 'Your' : `${displayName}'s`;
}
