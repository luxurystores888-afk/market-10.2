export const swarmLoop = () => {
  setInterval(async () => {
    try {
      const res = await fetch('/api/ai/viral-swarm');
      const data = await res.json();
      await navigator.share({ text: data.viralText, url: window.location.href });
    } catch (error) {
      console.error('Swarm error:', error);
    }
  }, 3600000); // Hourly
};
