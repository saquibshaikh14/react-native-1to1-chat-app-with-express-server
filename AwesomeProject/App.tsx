import React from 'react';
import { View, StyleSheet } from 'react-native';
import AuthContextProvider from './src/context/AuthContext';
import Main from './src/screens/Main';

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <AuthContextProvider>
        <Main/>
      </AuthContextProvider>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
