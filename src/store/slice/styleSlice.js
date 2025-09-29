export const styleSlice = (set) => ({
  sidebar: true,
  titleFont: "text-sm",
  botTitleColor: "text-gray-800",
  titleColot: "text-white",
  bubbleColor: "bg-blue-500",
  botBubbleColor: "bg-white",

  updateFontTitle(value) {
    set((state) => ({
      ...state,
      titleFont: value,
    }));
  },
  updateColorTitle(value) {
    set((state) => ({
      ...state,
      titleColor: value,
    }));
  },
  updateBotColorTitle(value) {
    set((state) => ({
      ...state,
      botTitleColor: value,
    }));
  },
  updateBubbleColor(value) {
    set((state) => ({
      ...state,
      bubbleColor: value,
    }));
  },
  updateBotBubbleColor(value) {
    set((state) => ({
      ...state,
      botBubbleColor: value,
    }));
  },
  updateSidebar() {
    set((state) => ({
      sidebar: !state.sidebar,
    }));
  },
});
