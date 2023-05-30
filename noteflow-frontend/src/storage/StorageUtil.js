const handleLang = (curMode) => {
  if (!curMode) {
    const lang = localStorage.getItem('noteflow-lang');
    if (!lang) {
      return 'zh';
    }
    return lang;
  }

  localStorage.setItem('noteflow-lang', curMode);
};

export { handleLang };
