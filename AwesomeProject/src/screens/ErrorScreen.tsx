import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ErrorScreen= ({ error }: {error: AppError}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorCode}>{error.errorCode}</Text>
      <Text style={styles.errorMessage}>{error.errorMessage}</Text>
      <Text style={styles.errorPage}>{error.errorPage}</Text>
      <Text style={styles.errorType}>{error.errorType}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  errorCode: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 18,
    marginBottom: 10,
  },
  errorPage: {
    fontSize: 16,
    marginBottom: 5,
  },
  errorType: {
    fontSize: 16,
  },
});

export default ErrorScreen;
