
function parseUsageLimit(limit) {
    return parseInt(limit, 10);
  }

  function subtractUsageLimit(limit, usedSeconds) {
    const currentLimit = parseUsageLimit(limit);
    const remaining = currentLimit - usedSeconds;
    return Math.max(0, Math.floor(remaining));
  }
  
  module.exports = {
    parseUsageLimit,
    subtractUsageLimit
  };
  