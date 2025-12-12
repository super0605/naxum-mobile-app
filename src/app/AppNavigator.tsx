import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './routes';
import { useAuthBootstrap } from '../hooks/useAuthBootstrap';
import { useAuthStore } from '../stores/auth.store';

import { LoginScreen } from '../screens/Auth/LoginScreen';
import { RegisterScreen } from '../screens/Auth/RegisterScreen';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { MemberProfileScreen } from '../screens/Team/MemberProfileScreen';
import { CreateTaskScreen } from '../screens/Tasks/CreateTaskScreen';
import { TaskDetailScreen } from '../screens/Tasks/TaskDetailScreen';
import { HierarchyScreen } from '../screens/Team/HierarchyScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  useAuthBootstrap();
  const { user, isBootstrapping } = useAuthStore();

  if (isBootstrapping) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'NaXum' }} />
          <Stack.Screen name="MemberProfile" component={MemberProfileScreen} options={{ title: 'Member' }} />
          <Stack.Screen name="CreateTask" component={CreateTaskScreen} options={{ title: 'Assign Task' }} />
          <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: 'Task Details' }} />
          <Stack.Screen name="Hierarchy" component={HierarchyScreen} options={{ title: 'Team Hierarchy' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
