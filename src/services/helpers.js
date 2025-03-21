const calculateTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} mins ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) return "yesterday";
    if (days === 2) return "two days ago";
    if (days < 7) return `${days} days ago`;
    
    const weeks = Math.floor(days / 7);
    if (weeks === 1) return "last week";
    if (weeks < 4) return `${weeks} weeks ago`;
    
    const months = Math.floor(days / 30);
    if (months === 1) return "last month";
    if (months < 12) return `${months} months ago`;
    
    const years = Math.floor(days / 365);
    if (years === 1) return "last year";
    return `${years} years ago`;
}


const addHours = (timestamp, hours) => {
    const date = new Date(timestamp);
    date.setHours(date.getHours() + hours);
    return date.toISOString(); // Convert back to string
}


export {calculateTimeAgo , addHours};
