export const getChatRoomId = (userA: string, userB: string) => {
  return [userA, userB].sort().join("_");
};