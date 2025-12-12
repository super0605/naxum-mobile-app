export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  MemberProfile: { memberId: string };
  CreateTask: undefined;
  TaskDetail: { taskId: string };
  Hierarchy: undefined;
};
