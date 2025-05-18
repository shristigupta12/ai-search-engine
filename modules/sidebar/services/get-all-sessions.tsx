export const getAllSessions = async () => {
    const response = await fetch('/api/sessions/all_sessions');
    if (!response.ok) {
        throw new Error('Failed to fetch sessions');
    }
    return response.json();
}